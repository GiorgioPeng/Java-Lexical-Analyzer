const keyWordsTable = [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
    'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final',
    'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int',
    'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public',
    'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this',
    'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while'
]

const input = document.querySelector("#input")

const signsTable = [
    '!', '%', '&', '*', '(', ')', '-', '=', '+', ';', '[', ']', '{', '}', ':', '\'', '"',
    '/', '?', '\\', '<', '>', ',', '.'
]

const resultSet = []

/*
    java命名规则:
        开头: 字母 或 _ 或 $   
        后面(任意个):字母 或 _ 或 $ 或 数字 
*/
const identifierPattern = /(\w|_|\$)(\w|_|\$|\d)*/

/*
    delete spaces
*/
const spaceDelete = (inputText) => {
    return inputText.replace(/\s+/g, "");
}

/*
    delete returns
*/
const returnDelete = (inputText) => {
    return inputText.replace(/(\r\n)|(\n)/g, "");
}


const createTableRow = (set) => {
    `
    <tr>
        <td>${set.string}</td>
        <td>${set.token}</td>
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
            else{
                continue;
            }
        }
    }
    if(lastIndex === 0){ // 说明没有找到符号
        return false;
    }
    

}

const lexicalAnalyze = () => {

}

const getInput = () => {
    input.value = formatInput(input.value)
}

(
    () => {
        input.onkeydown
            = (event) => {
                if ((event.keyCode || event.which) == '9') {
                    event.preventDefault()
                    input.value += '    '
                }
            }
    }
)()

