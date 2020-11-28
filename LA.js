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
 *  attribute: the symbols which are analysed
 * }
 * 
 * e.g
 *              {
 *                  token: keyword,
 *                  attribute: int
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
const constantPattern = /^-?\d+(\.\d+)?/

/**
 * the match pattern of String
 */
const stringPattern = /^\"[^\"]+\"/

/**
 * the match pattern of int/byt
 */
const intPattern = /^-?\d+/

/**
 * the match pattern of char
 */
const charPattern = /^\'.\'/

/**
 * the match pattern of float
 */
const floatPattern = /^-?\d+(\.\d+)?/


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
 * to delete all comments which are start from //
 * @param {string} inputText the origin input string
 * @return {string} the result of handling
 */
const commentDelete = (inputText) => {
    return inputText.replace(/\/\/.*/g, "")
}

/**
 * to delete all annotation like @Override
 * @param {string} inputText the origin input string
 * @return {string} the result of handling
 */
const annotationDelete = (inputText) => {
    return inputText.replace(/\@.*/g, "")
}

/**
 * to delete all comments which are between /* 
 * @param {string} inputText the origin input string
 * @return {string} the result of handling
 */
const complexCommentDelete = (inputText) => {
    return inputText.replace(/\/\*.*\*\//g, "")
}

/**
 * use result set to create a row of the output table
 * @param {object} set 
 * {
 *  token:
 *  attribute:
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
        <td>${set.attribute}</td>
    </tr>
    `
}

/**
 * to reformat the input string
 * @param {string} inputText the origin input string
 * @return {string} the result string after handling
 */
const formatInput = (inputText) => {
    return complexCommentDelete(lineBreakDelete(spaceDelete(annotationDelete(commentDelete(inputText)))))
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
            resultSet.push({ attribute: keyword, token: 'keyword' })
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
                resultSet.push({ attribute: tempResult[0], token: 'constant' })
                inputText = inputText.substr(tempResult[0].length)
            }
            break;
        case 'String':
            tempResult = inputText.match(stringPattern)
            if (tempResult != null) {
                resultSet.push({ attribute: '"', token: 'others' }) // record " sign
                resultSet.push({ attribute: tempResult[0].substr(1, tempResult[0].length - 2), token: 'constant' })
                resultSet.push({ attribute: '"', token: 'others' }) // record " sign
                inputText = inputText.substr(tempResult[0].length)
            }
            break;
        case 'char':
            tempResult = inputText.match(charPattern)
            if (tempResult != null) {
                resultSet.push({ attribute: "'", token: 'others' }) // record ' sign
                resultSet.push({ attribute: tempResult[0].substr(1, tempResult[0].length - 2), token: 'constant' })
                resultSet.push({ attribute: "'", token: 'others' }) // record ' sign
                inputText = inputText.substr(tempResult[0].length)
            }
            break;
        case 'identifier':
            tempResult = inputText.match(identifierPattern)
            if (tempResult != null) {
                resultSet.push({ attribute: tempResult[0], token: 'identifier' })
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
            resultSet.push({ attribute: sign, token: 'others' })
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
        // loop, to handle the situation of continuous mutiple keywords
        if (keywordMatch) {
            continue;
        }

        tempString = mainAnalyse('constant', tempString)
        tempString = mainAnalyse('String', tempString)
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
 * create a stopwatch element to tell the user that the page works normally
 */
const createStopWatch = () => {
    const stopWatch = document.createElement('div')
    stopWatch.innerHTML = `Running.......`
    stopWatch.className = 'stopWatch'
    document.body.appendChild(stopWatch)
}

/**
 * to detect whether the variable defining is wrong
 * @return {Boolean} whether we should reject the code
 */
const errorDetect = () => {
    const assignmentSet = resultSet.map((value, index) => {
        if (value.token === 'others' && value.attribute === '=') {
            return index
        }
        else {
            return
        }
    }).filter(e => e != undefined)

    let isReject = false
    for (index of assignmentSet) {
        switch (resultSet[index - 2].attribute) {
            case 'byte':
                if (resultSet[index + 1].attribute.match(intPattern) !== null)
                    if (
                        resultSet[index + 1].attribute.match(intPattern)[0].length === resultSet[index + 1].attribute.length &&
                        parseInt(resultSet[index + 1].attribute) >= -128 &&
                        parseInt(resultSet[index + 1].attribute) <= 127
                    );
                    else {
                        console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                        isReject = true;
                        return isReject
                    }
                else {
                    console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                    isReject = true;
                    return isReject
                }
                break;
            case 'int':
                if (resultSet[index + 1].attribute.match(intPattern) !== null)
                    if (
                        resultSet[index + 1].attribute.match(intPattern)[0].length === resultSet[index + 1].attribute.length &&
                        parseInt(resultSet[index + 1].attribute) >= -2147483648 &&
                        parseInt(resultSet[index + 1].attribute) <= 2147483647
                    );
                    else {
                        console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                        isReject = true;
                        return isReject
                    }
                else {
                    console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                    isReject = true;
                    return isReject
                }
                break;
            case 'short':
                if (resultSet[index + 1].attribute.match(intPattern) !== null)
                    if (
                        resultSet[index + 1].attribute.match(intPattern)[0].length === resultSet[index + 1].attribute.length &&
                        parseInt(resultSet[index + 1].attribute) >= -32768 &&
                        parseInt(resultSet[index + 1].attribute) <= 32767
                    );
                    else {
                        console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                        isReject = true;
                        return isReject
                    }
                else {
                    console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                    isReject = true;
                    return isReject
                }
                break;
            case 'long':
                if (resultSet[index + 1].attribute.match(intPattern) !== null)
                    if (
                        resultSet[index + 1].attribute.match(intPattern)[0].length === resultSet[index + 1].attribute.length &&
                        parseInt(resultSet[index + 1].attribute) >= -9223372036854774808n &&
                        parseInt(resultSet[index + 1].attribute) <= 9223372036854774807n
                    );
                    else {
                        console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                        isReject = true;
                        return isReject
                    }
                else {
                    console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                    isReject = true;
                    return isReject
                }
                break;
            case 'char':
                if (
                    resultSet[index + 1].attribute !== "'" ||
                    resultSet[index + 2].attribute.length !== 1 ||
                    resultSet[index + 3].attribute !== "'"
                ) {
                    console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                    isReject = true;
                    return isReject
                }
                break;
            case 'String':
                if (resultSet[index + 1].attribute !== '"') {
                    console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                    isReject = true;
                    return isReject
                }
                break;
            case 'double':
                if (resultSet[index + 1].attribute.match(floatPattern) !== null)
                    if (resultSet[index + 1].attribute.match(floatPattern)[0].length === resultSet[index + 1].attribute.length);
                    else {
                        console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                        isReject = true;
                        return isReject
                    }
                else {
                    console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                    isReject = true;
                    return isReject
                }
                break;
            case 'float':
                if (resultSet[index + 1].attribute.match(floatPattern) !== null)
                    if (resultSet[index + 1].attribute.match(floatPattern)[0].length === resultSet[index + 1].attribute.length);
                    else {
                        console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                        isReject = true;
                        return isReject
                    }
                else {
                    console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                    isReject = true;
                    return isReject
                }
                break;
            case 'boolean':
                if (resultSet[index + 1].attribute === 'true' || resultSet[index + 1].attribute === 'false');
                else {
                    console.log('Error is around: ' + resultSet[index - 2].attribute + ' ' + resultSet[index - 1].attribute + ' ' + resultSet[index].attribute + ' ' + resultSet[index + 1].attribute)
                    isReject = true;
                    return isReject
                }
                break;
            default:
                break;
        }
    }
    return isReject
}

/**
 * to analyse the input string
 */
const lexicalAnalyseStart = () => {
    resetTable()
    input.value = formatInput(input.value)
    // create the stop watch element
    createStopWatch()
    // change the Macro-task queue, avoid blocking UI rendering
    setTimeout(() => {
        lexicalAnalyse()
        document.body.removeChild(document.body.lastChild)
        errorDetect() ? alert('There is a bug! Please look up the console to get detail of the bug') : (() => {
            // remove the stop watch when analysis finished
            resultSet.map(
                (result) => {
                    tbody.innerHTML += createTableRow(result)
                }
            )
        })()
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

