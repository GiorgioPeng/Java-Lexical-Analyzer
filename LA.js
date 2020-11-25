/**
 * HTML element of input textarea
 */
const input = document.querySelector("#input")

/**
 * HTML element of the analyse result table body
 */
const tbody = document.querySelector('tbody')

/**
 * Java reserved keywords table
 */
const keyWordsTable = [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
    'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final',
    'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int',
    'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public',
    'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this',
    'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while'
]

/**
 * Java signs table
 */
const signsTable = [
    '++', '--', '==', '!=', '>=', '<=', '+=', '*=', '-=', '/=', '%=',
    '&&', '||', '!', '%', '&', '*', '(', ')', '-', '=', '+', ';',
    '[', ']', '{', '}', ':', '\'', '"', '/', '?', '\\', '<', '>',
    ',', '.'
]

/**
 * the analyse result set, a object array
 * {
 *  token: the token of corresponding symbols 
 *  string: the symbols which are analysed
 * }
 * 
 * e.g
 *              {
 *                  token: keyword,
 *                  string: int
 *              }
 */
const resultSet = []

/**
 * the match pattern of identifier
 */
const identifierPattern = /^(\w|_|\$)(\w|_|\$|\d)*/

/**
 * the match pattern of constant number
 */
const constantPattern = /^\d+/

/**
 * the match pattern of string
 */
const stringPattern = /^\".+\"/

/**
 * the match pattern of char
 */
const charPattern = /^\'.\'/

/**
 * to replace ≥ 1 spaces to only one space
 * @param {string} inputText the origin input string
 * @return {string} the result of handling
 */
const spaceDelete = (inputText) => {
    return inputText.replace(/\s+/g, " ");
}

/**
 * to delete all line breaks
 * @param {string} inputText the origin input string
 * @return {string} the result of handling
 */
const lineBreakDelete = (inputText) => {
    return inputText.replace(/(\r\n)|(\n)/g, "");
}

/**
 * use result set to create a row of the output table
 * @param {object} set 
 * {
 *  token:
 *  string:
 * }
 * @return {HTMLElement} the HTML element of the table row
 */
const createTableRow = (set) => {
    let bgcolor = 'white'
    switch (set.token) {
        case 'keyword':
            bgcolor = '#ffaaaa'
            break;
        case 'constant':
            bgcolor = '#aaffaa'
            break;
        case 'identifier':
            bgcolor = '#aaaaff'
            break;
        default:
            bgcolor = '#fff'
            break;
    }
    return `
    <tr style="background-color:${bgcolor}">
        <td>${set.token}</td>
        <td>${set.string}</td>
    </tr>
    `
}

/**
 * to reformat the input string
 * @param {string} inputText the origin input string
 * @return {string} the result string after handling
 */
const formatInput = (inputText) => {
    return lineBreakDelete(spaceDelete(inputText))
}

/**
 * analyse whether current first word of the string is a keyword
 * @param {string} inputText 
 * @return {boolean} whether a keyword is founded
 * @return {string} remaining string(excluded the keyword)
 */
const keywordsAnalyse = (inputText) => {
    for (keyword of keyWordsTable) {
        if (inputText.startsWith(keyword)) {
            resultSet.push({ string: keyword, token: 'keyword' })
            inputText = inputText.substr(keyword.length)
            keywordMatch = true;
            return [true, inputText]
        }
        else {
            continue;
        }
    }
    return [false, inputText];
}

/**
 * analyse main kinds of words of the input
 * @param {string} type which type of word should be scanned
 * @param {string} inputText the input string
 * @return {string} remaining string(excluded the word which was scanned)
 */
const mainAnalyse = (type, inputText) => {
    let tempResult = null
    switch (type) {
        case 'constant':
            tempResult = inputText.match(constantPattern)
            if (tempResult != null) {
                resultSet.push({ string: tempResult[0], token: 'constant' })
                inputText = inputText.substr(tempResult[0].length)
            }
            break;
        case 'string':
            tempResult = inputText.match(stringPattern)
            if (tempResult != null) {
                resultSet.push({ string: '"', token: 'others' }) // record " sign
                resultSet.push({ string: tempResult[0].substr(1, tempResult[0].length - 2), token: 'constant' })
                resultSet.push({ string: '"', token: 'others' }) // record " sign
                inputText = inputText.substr(tempResult[0].length)
            }
            break;
        case 'char':
            tempResult = inputText.match(charPattern)
            if (tempResult != null) {
                resultSet.push({ string: "'", token: 'others' }) // record ' sign
                resultSet.push({ string: tempResult[0].substr(1, tempResult[0].length - 2), token: 'constant' })
                resultSet.push({ string: "'", token: 'others' }) // record ' sign
                inputText = inputText.substr(tempResult[0].length)
            }
            break;
        case 'identifier':
            tempResult = inputText.match(identifierPattern)
            if (tempResult != null) {
                resultSet.push({ string: tempResult[0], token: 'identifier' })
                inputText = inputText.substr(tempResult[0].length)
            }
            break;
        default:
            break;
    }
    return inputText
}

/**
 * analyse all signs
 * @param {string} inputText the input string
 * @return {string} remaining string(excluded the sign which was scanned)
 */
const otherAnalyse = (inputText) => {
    if (inputText[0] === ' ')
        inputText = inputText.substr(1)
    for (sign of signsTable) {
        if (inputText.startsWith(sign)) {
            resultSet.push({ string: sign, token: 'others' })
            inputText = inputText.substr(sign.length)
            break;
        }
        else {
            continue;
        }
    }
    return inputText
}

/**
 * analyse the input string
 */
const lexicalAnalyse = () => {
    let tempString = input.value
    while (tempString.length > 0) {
        if (tempString[0] === ' ') // delete space
            tempString = tempString.substr(1)

        let keywordMatch = false;
        [keywordMatch, tempString] = keywordsAnalyse(tempString)
        // loop, to handle the situation of  mutiple keyword
        if (keywordMatch) {
            continue;
        }

        tempString = mainAnalyse('constant', tempString)
        tempString = mainAnalyse('string', tempString)
        tempString = mainAnalyse('char', tempString)
        tempString = mainAnalyse('identifier', tempString)
        tempString = otherAnalyse(tempString)
    }
}

/**
 * reset the body of the output table and the result set
 */
const resetTable = () => {
    tbody.innerHTML = ''
    resultSet.length = 0
}

/**
 * to analyse the input string
 */
const lexicalAnalyseStart = () => {
    resetTable()
    input.value = formatInput(input.value)

    // change the Macro-task queue, avoid blocking UI rendering
    setTimeout(() => {
        lexicalAnalyse()
        resultSet.map(
            (result) => {
                tbody.innerHTML += createTableRow(result)
            }
        )
    }, 0);
}

/**
 * change the default events if users use 'tab' in the input textarea
 */
(
    () => {
        input.onkeydown
            = (event) => {
                if ((event.keyCode || event.which) == '9') {
                    event.preventDefault()
                    // except the IE browser, adjust the position before user input a tab
                    let currentPosition = input.selectionStart
                    let frontPart = input.value.substring(0, currentPosition) + '    '
                    input.value = frontPart + input.value.substring(currentPosition)

                    // modify the input position
                    input.selectionStart = frontPart.length
                    input.selectionEnd = frontPart.length
                }
            }
    }
)()

