const Discord = require('discord.js')
const client = new Discord.Client()

var roll = require('./roll.js')
var config = require('./config.js')

// Other global
let butter = 0

// Connect 4
let c4MessageObject = undefined
let c4GameState = 0
let c4Teams = {}
let c4Mode = -1
let inGame = 0
let c4BoardState = []
for(let i = 0; i < 6; i++) {
    let inside = []
    for(let j = 0; j < 7; j++) {
        inside.push(0)
    }
    c4BoardState.push(inside)
}

let c4GM = require('./connect4.js')
resetC4Game()

function setC4Object(theObject) {
    c4MessageObject = theObject
}

function updateBoardState(newState, ended) {
    c4BoardState = newState
    if(ended) {
        resetC4Game()
    } else if(c4GameState === 0) {
        c4GameState = 1
    } else if(c4GameState === 1) {
        c4GameState = 2
    } else if(c4GameState === 2) {
        c4GameState = 1
    }
}

function updateStartGame() {
    c4GameState = 1
}

function resetC4Game() {
    c4BoardState = []
    for(let i = 0; i < 6; i++) {
        let inside = []
        for(let j = 0; j < 7; j++) {
            inside.push(0)
        }
        c4BoardState.push(inside)
    }
    c4MessageObject = undefined
    c4GameState = 0
    inGame = 0
}

// Config items
let token = config.getBotToken()
let botID = config.getBotID()
let generalChannelId = config.getGeneralChannel()
let insideRoleId = config.getInsideRole()
let peopleRoleId = config.getPeopleRole()
let traitorRoleId = config.getTraitorRole()

let roles = {
    inside: insideRoleId,
    people: peopleRoleId,
    traitor: traitorRoleId
}

function voucher(source) {
    var allowed = false;
    source.member.roles.forEach((role) => {
        if(role.id == insideRoleId) {
            allowed = true;
        }
    });
    return allowed;
}

function randomInteger(min, max) {
    return (parseInt(Math.floor(Math.random() * (max - min + 1))) + parseInt(min))
}

function isBot(ID) {
    return botID.includes(ID)
}

// Helper

function isAllNumbers(input) {
    var regNumbers = /[0-9]/g;
    var regResult = input.match(regNumbers)
    if(input.length === regResult.length) return true
    return false
}

client.on('ready', () => {
})
client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }
    // Butter easter egg

    if(butter === 1) {
        if(receivedMessage.content.toLowerCase() === 'you pass butter' ||
          (receivedMessage.content.toLowerCase().includes('roll') && !receivedMessage.content.toLowerCase().includes('/roll'))
        ) {
            receivedMessage.channel.send('Oh my god...')
        }
        butter = 2
        return
    }
    // Commands
    var commands = receivedMessage.content.split(' ')

    switch(commands[0]) {
        /*
        case '/channels':
            client.guilds.forEach((guild) => {
                guild.channels.forEach((channel) => {
                    receivedMessage.channel.send('Name: ' + channel.name + ' ID: ' + channel.id)
                })
            })
        break
        */

        /*
        case '/members':
            var members = receivedMessage.guild.members;
            members.forEach((member) => {
                receivedMessage.channel.send(member.displayName)
            })
        case '/server':
            receivedMessage.channel.send(receivedMessage.guild.id)
        break
        */
        // Server
        case '/status':
            receivedMessage.channel.send('Bot is UP')
        break
        case '/myid':
            receivedMessage.channel.send('Your ID is: ' + receivedMessage.member.id)
        break
        // PS Roles
        case '/assignall':
            if(receivedMessage.member.id != '195682347876745216') {
                receivedMessage.channel.send('Not allowed.')
                break
            }
            if(commands.length > 2) {
                receivedMessage.channel.send('Please include only name. /assignall name.')
            }
            else if(commands.length < 2) {
                receivedMessage.channel.send('Please include name. /assignall name.')
            } else {
                if(roles[commands[1]] != undefined){
                    var members = receivedMessage.guild.members
                    members.forEach((member) => {
                        member.addRole(roles[commands[1]]).catch(console.error)
                    })
                } else {
                    receivedMessage.channel.send('Not in approved roles.')
                }
            }
        break
        case '/roles':
            receivedMessage.guild.roles.forEach((role) => {
                receivedMessage.channel.send('Name: ' + role.name + '| ID: ' + role.id)
            })
        break
        case '/vouch':
            // PS Server only command
            if(receivedMessage.guild.id !== '373514118822494211') return
            if(!voucher(receivedMessage)) {
                receivedMessage.channel.send('Not allowed.')
                break
            }
            if(commands.length < 2) {
                receivedMessage.channel.send('Please include name: /vouch name.')
            } else {
                let buildName = ''
                for(let i = 1; i < commands.length; i++) {
                    buildName += commands[i]
                    if(i + 1 < commands.length) {
                        buildName += ' '
                    }
                }
                var members = receivedMessage.guild.members
                members.forEach((member) => {
                    if(member.displayName == buildName) {
                        member.addRole(insideRoleId).catch(console.error)
                            //.catch(receivedMessage.channel.send('Some shit went wrong. Paging <@195682347876745216>.'))
                            //.then(receivedMessage.channel.send(commands[1] + ', be free!'))
                    }
                })
            }
        break
        case '/traitor':
            if(receivedMessage.guild.id !== '373514118822494211') return
            if(!voucher(receivedMessage)) {
                receivedMessage.channel.send('Not allowed.')
                break
            }
            if(commands.length < 2) {
                receivedMessage.channel.send('Please include name: /traitor name.')
            } else {
                let buildName = ''
                for(let i = 1; i < commands.length; i++) {
                    buildName += commands[i]
                    if(i + 1 < commands.length) {
                        buildName += ' '
                    }
                }
                var members = receivedMessage.guild.members
                members.forEach((member) => {
                    if(member.displayName == buildName) {
                        //receivedMessage.channel.send(traitorRoleId)
                        member.addRole(traitorRoleId).catch(console.error)
                        member.removeRole(peopleRoleId).catch(console.error)
                    }
                })
            }
        break
        case '/people':
            // PS Server only command
            if(receivedMessage.guild.id !== '373514118822494211') return
            if(!voucher(receivedMessage)) {
                receivedMessage.channel.send('Not allowed.')
                break
            }
            if(commands.length < 2) {
                receivedMessage.channel.send('Please include name. /people name.')
            }
            else {
                let buildName = ''
                for(let i = 1; i < commands.length; i++) {
                    buildName += commands[i]
                    if(i + 1 < commands.length) {
                        buildName += ' '
                    }
                }
                var members = receivedMessage.guild.members
                members.forEach((member) => {
                    if(member.displayName == buildName) {
                        member.addRole(peopleRoleId).catch(console.error)
                        member.removeRole(traitorRoleId).catch(console.error)
                    }
                })
            }
        break
        case '/help':
            // PS Server only command
            if(true || receivedMessage.member.id == '195682347876745216') {
                var helpString = ''
                helpString += '/vouch (displayName) - Adds user to \'inside\' role. Only users with the \'inside\' role can use commands.'
                helpString += '\n/people (displayName) - Adds user to people role and removes from traitor role.'
                helpString += '\n/traitor (displayName) - Adds user to traitor role and removes from people role.'
                helpString += '\n/help - Help menu.'
                receivedMessage.channel.send(helpString)
            } else {
                receivedMessage.channel.send('', {files: ['https://i.imgflip.com/2xoads.jpg']})
            }
        break
        // General Server
        case '/reset':
            if(commands[1] === 'butter') {
                butter = 0
            } 
        break
        // Other
        case '/roll':
            // Easter Egg Butter
            if(butter === 0 && randomInteger(1, 20) === 1) {
            //if(butter === 0 && true) {
                receivedMessage.channel.send('What is my purpose?')
                butter = 1
                return
            }
            receivedMessage.channel.send(roll.run(commands))
            /*
            if(commands.length == 2) {
                if(isAllNumbers(commands[1])) {
                    receivedMessage.channel.send('[ ' + randomInteger(1, commands[1]) + ' ]')
                } else if(commands[1].includes('d')) {
                    var rollCommands = commands[1].split('d')
                    if(rollCommands.length !== 2) {
                        receivedMessage.channel.send('Neigh')
                        return
                    }
                    if(isAllNumbers(rollCommands[0]) &&
                       parseInt(rollCommands[0]) > 0 &&
                       isAllNumbers(rollCommands[1]) &&
                       parseInt(rollCommands[1]) > 0) {
                        let rollResults = ''
                        for(let i = 0; i < rollCommands[0]; i++) {
                            rollResults += '[ ' + randomInteger(1, parseInt(rollCommands[1])) + ' ]'
                        }
                        receivedMessage.channel.send(rollResults)
                    } else {
                        receivedMessage.channel.send('Neigh')
                    }
                } else {
                    receivedMessage.channel.send('Neigh')
                }
            } 
            else if(commands.length == 3) {
                receivedMessage.channel.send(randomInteger('[ ' + commands[1],commands[2]) + ' ]')
            } else {
                receivedMessage.channel.send('[ ' + randomInteger(1,20) + ' ]')
            }
            */
        break
        case '/test':

        break
        case '/c4':
        case '/connect4':
            if(receivedMessage.guild.id === '373514118822494211') return
            // Probably could have shoved more code into connect4.js. I'll come back and consolidate someday.
            if(commands.length > 1 && commands[1] === 'kill') {
                resetC4Game()
                return
            }
            if(inGame === 0) {
                inGame = 1
                let side = 1
                c4Teams[receivedMessage.member.id] = side
                if(commands.length > 1) {
                    c4Mode = 1
                    let opponent = commands[1]
                    for(let i = 2; i < commands.length; i++) {
                        opponent += ' ' + commands[2]
                    }
                    if(side === 1) {
                        receivedMessage.guild.members.forEach(element => {
                            if(element.nickname === opponent || element.user.username === opponent) {
                                c4Teams[element.user.id] = 2
                            }
                        })
                    } else {
                        receivedMessage.guild.members.forEach(element => {
                            if(element.nickname === opponent || element.user.username === opponent) {
                                c4Teams[element.user.id] = 1
                            }
                        })
                    }
                } else {
                    c4Mode = 0
                }
                c4GM.startConnect4Game(receivedMessage, setC4Object, updateStartGame)
            }
        break
        default:
        break
    }
    // Table Flips
    if(receivedMessage.content.includes('(╯°□°)╯︵ ┻━┻')
    || receivedMessage.content.includes('(╯°□°）╯︵ ┻━┻')
    || receivedMessage.content.includes('(ﾉಥ益ಥ）ﾉ﻿ ┻━┻')
    || receivedMessage.content.includes('(ﾉಥ益ಥ）ﾉ ┻━┻')
    || receivedMessage.content.includes('┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻')
    || receivedMessage.content.includes('┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻')
    || receivedMessage.content.includes('ヽ(ຈل͜ຈ)ﾉ︵ ┻━┻')
    || receivedMessage.content.includes('(ノಠ益ಠ)ノ彡┻━┻')) {
        let response = Math.floor(Math.random() * 10)
        switch(response) {
            case 1:
                receivedMessage.channel.send('Dude, please.    ┬─┬ノ( º _ ºノ)')
            break
            case 2:
                receivedMessage.channel.send('Dude, please.    ┬─┬ノ( º _ ºノ)')
            break
            case 3:
                receivedMessage.channel.send('Dude, please.    ┬─┬ノ( º _ ºノ)')
            break
            case 4:
                receivedMessage.channel.send('Dammit, ' + receivedMessage.member.displayName + '.    ┬─┬ノ( º _ ºノ)')
            break
            case 5:
                receivedMessage.channel.send('Dude, please.    ┬─┬ノ( º _ ºノ)')
            break
            default:
                receivedMessage.channel.send('Comon man.    ┬─┬ノ( º _ ºノ)')
            break
        }
    }
    // Ping
    /*
    if(receivedMessage.content == 'ping') {
        receivedMessage.channel.send('pong')
    }
    */
})

client.on('messageReactionAdd', (reaction, user) => {
    if(isBot(user.id)) return // Ignore bot reactions
    if(c4GameState === 0) return
    if(c4Mode === 1) {
        if(typeof c4Teams[user.id] === 'undefined') { return }
        else if(c4Teams[user.id] !== c4GameState) { return } 
    } else if(c4Mode === 0) {
        if(typeof c4Teams[user.id] === 'undefined') { 
            c4Teams[user.id] = c4GameState 

        } else if(c4Teams[user.id] !== c4GameState) {
            return
        }
    } else {
        return
    }
    if(!['🕐','🕑','🕒','🕓','🕔','🕕','🕖'].includes(reaction.emoji.name)) return
    switch(reaction.emoji.name) {
        case '🕐':
            c4GM.move(c4MessageObject, c4BoardState, 0, c4GameState, updateBoardState)
        break
        case '🕑':
            c4GM.move(c4MessageObject, c4BoardState, 1, c4GameState, updateBoardState)
        break
        case '🕒':
            c4GM.move(c4MessageObject, c4BoardState, 2, c4GameState, updateBoardState)
        break
        case '🕓':
            c4GM.move(c4MessageObject, c4BoardState, 3, c4GameState, updateBoardState)
        break
        case '🕔':
            c4GM.move(c4MessageObject, c4BoardState, 4, c4GameState, updateBoardState)
        break
        case '🕕':
            c4GM.move(c4MessageObject, c4BoardState, 5, c4GameState, updateBoardState)
        break
        case '🕖':
            c4GM.move(c4MessageObject, c4BoardState, 6, c4GameState, updateBoardState)
        break
    }
})


client.on('messageReactionRemove', (reaction, user) => {
    if(isBot(user.id)) return // Ignore bot reactions
    if(c4GameState === 0) return
    if(c4Mode === 1) {
        if(typeof c4Teams[user.id] === 'undefined') { return }
        else if(c4Teams[user.id] !== c4GameState) { return } 
    } else if(c4Mode === 0) {
        if(typeof c4Teams[user.id] === 'undefined') { 
            c4Teams[user.id] = c4GameState 
        } else if(c4Teams[user.id] !== c4GameState) {
            return
        }
    } else {
        return
    }    if(!['🕐','🕑','🕒','🕓','🕔','🕕','🕖'].includes(reaction.emoji.name)) return
    switch(reaction.emoji.name) {
        case '🕐':
            c4GM.move(c4MessageObject, c4BoardState, 0, c4GameState, updateBoardState)
        break
        case '🕑':
            c4GM.move(c4MessageObject, c4BoardState, 1, c4GameState, updateBoardState)
        break
        case '🕒':
            c4GM.move(c4MessageObject, c4BoardState, 2, c4GameState, updateBoardState)
        break
        case '🕓':
            c4GM.move(c4MessageObject, c4BoardState, 3, c4GameState, updateBoardState)
        break
        case '🕔':
            c4GM.move(c4MessageObject, c4BoardState, 4, c4GameState, updateBoardState)
        break
        case '🕕':
            c4GM.move(c4MessageObject, c4BoardState, 5, c4GameState, updateBoardState)
        break
        case '🕖':
            c4GM.move(c4MessageObject, c4BoardState, 6, c4GameState, updateBoardState)
        break
    }
})


client.login(token)

