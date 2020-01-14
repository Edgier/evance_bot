function randomInteger(min, max) {
    return (parseInt(Math.floor(Math.random() * (max - min + 1))) + parseInt(min))
}

function isAllNumbers(input) {
    if(input.length === 0) return false
    var regNumbers = /[0-9]/g;
    var regResult = input.match(regNumbers)
    if(input.length === regResult.length) return true
    return false
}

function detectDFormat(input) {
    let diceBreakdown = input.split('d')
    if(diceBreakdown.length === 2 && isAllNumbers(diceBreakdown[0]) && isAllNumbers(diceBreakdown[1])) return true
    return false
}

function rollD(input) {
    let diceBreakdown = input.split('d')
    let resultString = '(' + input + ')'
    for(let i = 0; i < diceBreakdown.length; i++) {
        resultString += '[ ' + randomInteger(1, diceBreakdown[1]) + ' ]'
    }
    return resultString
}

module.exports = {
    run:(input) => {
        // Command breakdown
        let commandList = input
        commandList.shift()
        if(commandList.length === 0) {
            return randomInteger(1, 20)
        } else if(commandList.length === 1) {
            if(isAllNumbers(commandList[0])) {
                return randomInteger(1, commandList[0])
            } else if(detectDFormat(commandList[0])) {
                return rollD(commandList[0])
            }
        } else {
            let resultString = ''
            for(let i = 0; i < commandList.length; i++) {
                if(!detectDFormat(commandList[i])) return 'Nah'
                resultString += rollD(commandList[i]) + '\n'
            }
            return resultString
        }
    }
}