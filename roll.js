function randomInteger(min, max) {
    return (parseInt(Math.floor(Math.random() * (max - min + 1))) + parseInt(min))
}

function isAllNumbers(input) {
    if(input.length === 0) return false
    var regNumbers = /[0-9]/g;
    var regResult = input.match(regNumbers)
    if(regResult !== null && input.length === regResult.length) return true
    return false
}

function detectDFormat(input) {
    let diceBreakdown = input.split('d')
    if(diceBreakdown.length !== 2) return false
    if(!isAllNumbers(diceBreakdown[0])) return false 
    if((diceBreakdown[1].includes('+') || diceBreakdown[1].includes('-'))) {
        if((diceBreakdown[1].includes('+') && diceBreakdown[1].includes('-'))) return false
        let diceAndBonus = ['','']
        if(diceBreakdown[1].includes('+')) {
            diceAndBonus = diceBreakdown[1].split('+')
        } else {
            diceAndBonus = diceBreakdown[1].split('-')
        }
        if(!isAllNumbers(diceAndBonus[0])) return false
        if(!isAllNumbers(diceAndBonus[1])) return false
        return true
    } else if(isAllNumbers(diceBreakdown[1])) return true
    return false
}

function rollDice(input) {
    let diceBreakdown = input.split('d')
    let resultString = '(' + input + ')'
    let sum = 0
    let diceAndBonus = ['','']
    for(let i = 0; i < diceBreakdown.length; i++) {
        if(diceBreakdown[1].includes('+')) {
            diceAndBonus = diceBreakdown[1].split('+')
            let roll = randomInteger(1, diceAndBonus[0])
            resultString += '[ ' + roll.toString() + ' ]'
            sum += roll
        } else if(diceBreakdown[1].includes('-')) {
            console.log('here')
            diceAndBonus = diceBreakdown[1].split('-')
            let roll = randomInteger(1, diceAndBonus[0])
            resultString += '[ ' + roll.toString() + ' ]'
            sum += roll
        } else {
            let roll = randomInteger(1, diceBreakdown[1])
            resultString += '[ ' + roll + ' ]'
            sum += roll
        }
    }
    if(diceBreakdown[1].includes('+')) {
        resultString += ' + ' + diceAndBonus[1]
        sum += parseInt(diceAndBonus[1])
    } else if(diceBreakdown[1].includes('-')) {
        resultString += ' - ' + diceAndBonus[1]
        sum -= parseInt(diceAndBonus[1])
    }
    resultString += ' = ' + sum
    return resultString
}

//console.log(run(['/roll','2d10-1']))


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
                return rollDice(commandList[0])
            } else {
                return 'Nah'
            }
        } else {
            let resultString = ''
            for(let i = 0; i < commandList.length; i++) {
                if(!detectDFormat(commandList[i])) return 'Nah'
                resultString += rollDice(commandList[i]) + '\n'
            }
            return resultString
        }
    }
}