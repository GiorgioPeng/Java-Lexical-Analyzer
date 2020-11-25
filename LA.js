const keyWordsTable = [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
    'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final',
    'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int',
    'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public',
    'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this',
    'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while'
]

const input = document.querySelector("#input")

const tbody = document.querySelector('tbody')

const signsTable = [
    '++', '--', '==', '!=', '>=', '<=','+=','*=','-=','/=','%=',
    '&&', '||', '!', '%', '&', '*', '(', ')', '-', '=', '+', ';',
    '[', ']', '{', '}', ':', '\'', '"', '/', '?', '\\', '<', '>',
    ',', '.'
]

const resultSet = []

/*
    java命名规则:
        开头: 字母 或 _ 或 $   
        后面(任意个):字母 或 _ 或 $ 或 数字 
*/
const identifierPattern = /^(\w|_|\$)(\w|_|\$|\d)*/

/*
    数值常量匹配
*/
const constantPattern = /^\d+/

/**
 * 字符串常量匹配
 */
const stringPattern = /^\".+\"/

/**
 * 字符常量匹配
 */
const charPattern = /^\'.\'/

/*
    delete spaces
*/
const spaceDelete = (inputText) => {
    return inputText.replace(/\s+/g, " ");
}

/*
    delete returns
*/
const returnDelete = (inputText) => {
    return inputText.replace(/(\r\n)|(\n)/g, "");
}


const createTableRow = (set) => {
    return   `
    <tr>
        <td>${set.token}</td>
        <td>${set.string}</td>
    </tr>
    `
}

/*
    format input
*/
const formatInput = (inputText) => {
    return returnDelete(spaceDelete(inputText))
}

/*
    keyword 分析
    return: true 说明找到了
    return: false 说明没有找到,可以直接拒绝
*/
const keywordsAnalyze = (inputText) => {
    for (i of keyWordsTable) {
        if (inputText.substr(0, i.length) === i) { // 如果匹配到关键字
            resultSet.push({ string: inputText.substr(0, i.length), token: 'keyword' }) // 记录token
            inputText = inputText.slice(i.length) // 删掉关键字
            return true;
        }
        else {
            continue;
        }
    }
    return false;
}

/*
    identifier 分析
    
    因为java 必须使用;结尾, 最简单的 int a; 也有分号, 所以这里应该一直到找到下一个符号为止

    return: true 说明找到了
    return: false 说明没有找到,可以直接拒绝
*/
const identifierAnalyze = (inputText) => {
    let lastIndex = 0;
    // 因为剩下的字符串可能很长, 所以使用符号匹配字符
    for (i of inputText) {
        for (let signIndex = 0; signIndex < signsTable.length; signIndex++) {
            if (i === signsTable[signIndex]) {//说明找到了符号, 然后需要记录位置
                lastIndex = signIndex
                break;
            }
            else {
                continue;
            }
        }
    }
    if (lastIndex === 0) { // 说明没有找到符号
        return false;
    }


}

const lexicalAnalyze = () => {
    let tempString = input.value
    while (tempString.length > 0) {
        if (tempString[0] === ' ') // 剔除空格
            tempString = tempString.substr(1)

        // 关键字匹配
        let keywordMatch = false;
        for (keyword of keyWordsTable) {
            if (tempString.startsWith(keyword)) {//如果是用这个开头,说明匹配成功
                // console.log('keyword: ' + keyword)
                resultSet.push({ string: keyword, token: 'keyword' })
                tempString = tempString.substr(keyword.length)// 删掉关键字
                keywordMatch = true;// 准备再次循环, 处理多关键字的情况
                break;
            }
            else {
                continue;
            }
        }
        // 再次循环, 处理多关键字的情况
        if (keywordMatch) {
            continue;
        }

        let tempResult = tempString.match(constantPattern)
        if (tempResult != null) {
            resultSet.push({ string: tempResult[0], token: 'constant' })
            tempString = tempString.substr(tempResult[0].length)
        }
        tempResult = null

        tempResult = tempString.match(stringPattern)
        if (tempResult != null) {
            resultSet.push({ string: '"', token: 'others' }) // 需要添加操作符号,会略过
            resultSet.push({ string: tempResult[0].substr(1,tempResult[0].length-2), token: 'constant' })
            resultSet.push({ string: '"', token: 'others' }) // 需要添加操作符号,会略过
            tempString = tempString.substr(tempResult[0].length)
            // console.log(tempString)
        }
        tempResult = null

        tempResult = tempString.match(charPattern)
        if (tempResult != null) {
            resultSet.push({ string: "'", token: 'others' }) // 需要添加操作符号,会略过
            resultSet.push({ string: tempResult[0].substr(1,tempResult[0].length-2), token: 'constant' })
            resultSet.push({ string: "'", token: 'others' }) // 需要添加操作符号,会略过
            tempString = tempString.substr(tempResult[0].length)
        }
        tempResult = null


        // 变量标识符匹配(没有多个变量标识符的状态,多个至少会存在符号隔开)
        tempResult = tempString.match(identifierPattern)
        /*
         ["public", "p", "c", index: 0, input: "public static String main(String[] args) { int i =…: i -= 20; default: Byte b = '1'; } return a; } }", groups: undefined]
        */
        // console.log(tempResult)
        if (tempResult != null) {
            // console.log('identifier: ' + tempResult[0])
            resultSet.push({ string: tempResult[0], token: 'identifier' })
            tempString = tempString.substr(tempResult[0].length)
            // console.log(tempString)
        }

        // 其他符号匹配
        if (tempString[0] === ' ') // 剔除空格
            tempString = tempString.substr(1)
        for (sign of signsTable) {
            if (tempString.startsWith(sign)) {
                // console.log('sign: ' + sign)
                resultSet.push({ string: sign, token: 'others' })
                tempString = tempString.substr(sign.length)// 删掉关键字
                break;
            }
            else {
                continue;
            }
        }
        // console.log('tempString: ' + tempString)
    }
    // console.log(resultSet)
}

const getInput = () => {
    input.value = formatInput(input.value)
    setTimeout(() => {
        lexicalAnalyze()
        resultSet.map(
            (result) => {
                tbody.innerHTML += createTableRow(result)
            }
        )
    }, 0);
}

(
    () => {
        input.onkeydown
            = (event) => {
                if ((event.keyCode || event.which) == '9') {
                    event.preventDefault()
                    // 除了IE浏览器, 调整tab输入位置
                    let currentPosition = input.selectionStart
                    let frontPart = input.value.substring(0, currentPosition) + '    '
                    input.value = frontPart + input.value.substring(currentPosition)

                    // 调整光标位置
                    input.selectionStart = frontPart.length
                    input.selectionEnd = frontPart.length
                }
            }
    }
)()

