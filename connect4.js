const colors =  [':white_circle:',':blue_circle:',':red_circle:']

function buildBoard(state) {
    let boardString = ''
    for(let i = 0; i < 6; i++) {
        boardString += '.  '
        for(let j = 0; j < 6; j++) {
            boardString += colors[state[i][j]]
            boardString += '  ...  '
        }
        boardString += colors[state[i][6]]
        boardString += '  .\n\n'
    }
    return boardString
}

function checkWin(state) {
    // Yes I know, this function is extremely inefficient. n^2 is not a big deal when n = 4 Kappa.
    for(let i = 0; i < 6; i++) {
        for(let j = 0; j < 4; j++) {
            if(state[i][j] === 0) continue
            if(state[i][j] === state[i][j + 1]) {
                if(state[i][j] === state[i][j + 2]) {
                    if(state[i][j] === state[i][j + 3]) {
                        return true  
                    }
                    
                }
            }
        }
    }
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 7; j++) {
            if(state[i][j] === 0) continue
            if(state[i][j] === state[i + 1][j]) {
                if(state[i][j] === state[i + 2][j]) {
                    if(state[i][j] === state[i + 3][j]) {
                        return true  
                    }
                }
            }
        }
    }
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 4; j++) {
            if(state[i][j] === 0) continue
            if(state[i][j] === state[i + 1][j + 1]) {
                if(state[i][j] === state[i + 2][j + 2]) {
                    if(state[i][j] === state[i + 3][j + 3]) {
                        return true  
                    }
                }
            }
        }
    }
    for(let i = 5; i >= 3; i--) {
        for(let j = 0; j < 4; j++) {
            if(state[i][j] === 0) continue
            if(state[i][j] === state[i - 1][j + 1]) {
                if(state[i][j] === state[i - 2][j + 2]) {
                    if(state[i][j] === state[i - 3][j + 3]) {
                        return true  
                    }
                }
            }
        }
    }
}

module.exports = {
    startConnect4Game: (receivedMessage, setGameMessageID, updateStartGame) => {
        let boardState = []
        for(let i = 0; i < 6; i++) {
            let inside = []
            for(let j = 0; j < 7; j++) {
                inside.push(0)
            }
            boardState.push(inside)
        }
        receivedMessage.channel.send('Blue turn\n\n' + buildBoard(boardState))
            .then(message => {
                setGameMessageID(message)
                message.react('🕐').then(() => {
                    message.react('🕑').then(() => {
                        message.react('🕒').then(() => {
                            message.react('🕓').then(() => {
                                message.react('🕔').then(() => {
                                    message.react('🕕').then(() => {
                                        message.react('🕖').then(() => {
                                            updateStartGame()
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
            .catch((error) => {
                console.log(error)
            })
                            /*
                message.react('🕒')
                message.react('🕓')
                message.react('🕔')
                message.react('🕕')
                message.react('🕖')
                */
    },
    move: (messageObject, state, column, player, updateState) => {
        if(messageObject === undefined) return
        let newState = state
        let i = 5
        for(; i >= 0; i--) {
            if(state[i][column] === 0) {
                newState[i][column] = player
                break
            }
        }
        if(i === -1) return
        let playerColor = 'blue'
        if(player === 2) {
            playerColor = 'Blue'
        } else {
            playerColor = 'Red'
        }
        title = playerColor + ' turn\n\n'
        if(checkWin(newState)) {
            if(player === 1) {
                playerColor = 'Blue'
            } else {
                playerColor = 'Red'
            }
            title = playerColor + ' wins!\n\n'
        }
        messageObject.edit(title + buildBoard(newState))
            .then(message => {
                updateState(newState, checkWin(newState))
            })
    }
}