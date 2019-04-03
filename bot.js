const Discord = require('discord.js')
const client = new Discord.Client()

var config = require('./config.js')

// Config items
let token = config.getBotToken()
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

client.on('ready', () => {

})
client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }
    // Commands
    var commands = receivedMessage.content.split(' ');
    switch(commands[0]) {
        /*
        case '/channels':
            client.guilds.forEach((guild) => {
                guild.channels.forEach((channel) => {
                    receivedMessage.channel.send('Name: ' + channel.name + ' ID: ' + channel.id)
                })
            })
        break
        case '/members':
            var members = receivedMessage.guild.members;
            members.forEach((member) => {
                receivedMessage.channel.send(member.displayName)
            })
            */
        case '/assignall':
            if(receivedMessage.member.id == '195682347876745216') {
                receivedMessage.channel.send('Not allowed.')
                break
            }
            if(commands.length > 2) {
                receivedMessage.channel.send('Please include only name. /vouch name.')
            }
            else if(commands.length < 2) {
                receivedMessage.channel.send('Please include name. /vouch name.')
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
        /*
            var allowed = false;
            receivedMessage.member.roles.forEach((role) => {
                if(role.id == insideRoleId) {
                    allowed = true;
                }
            });
        */
            if(!voucher(receivedMessage)) {
                receivedMessage.channel.send('Not allowed.')
                break
            }
            if(commands.length > 2) {
                receivedMessage.channel.send('Please include only name. /vouch name.')
            }
            else if(commands.length < 2) {
                receivedMessage.channel.send('Please include name. /vouch name.')
            }
            else {
                var members = receivedMessage.guild.members
                members.forEach((member) => {
                    if(member.displayName == commands[1]) {
                        member.addRole(insideRoleId).catch(console.error)
                            //.catch(receivedMessage.channel.send('Some shit went wrong. Paging <@195682347876745216>.'))
                            //.then(receivedMessage.channel.send(commands[1] + ', be free!'))
                    }
                })
            }
        break
        case '/traitor':
            if(!voucher(receivedMessage)) {
                receivedMessage.channel.send('Not allowed.')
                break
            }
            if(commands.length > 2) {
                receivedMessage.channel.send('Please include only name. /traitor name.')
            }
            else if(commands.length < 2) {
                receivedMessage.channel.send('Please include name. /traitor name.')
            }
            else {
                var members = receivedMessage.guild.members
                members.forEach((member) => {
                    if(member.displayName == commands[1]) {
                        member.addRole(traitorRoleId).catch(console.error)
                        member.removeRole(peopleRoleId).catch(console.error)
                    }
                })
            }
        break
        case '/people':
        if(!voucher(receivedMessage)) {
            receivedMessage.channel.send('Not allowed.')
            break
        }
        if(commands.length > 2) {
            receivedMessage.channel.send('Please include only name. /traitor name.')
        }
        else if(commands.length < 2) {
            receivedMessage.channel.send('Please include name. /traitor name.')
        }
        else {
            var members = receivedMessage.guild.members
            members.forEach((member) => {
                if(member.displayName == commands[1]) {
                    member.addRole(peopleRoleId).catch(console.error)
                    member.removeRole(traitorRoleId).catch(console.error)
                }
            })
        }
        break
        case '/help':
            if(receivedMessage.member.id == '195682347876745216') {
                var helpString = ''
                helpString += '/vouch (displayName) - Adds user to \'inside\' role.'
                helpString += '\n/people (displayName) - Adds user to people role and removes from traitor role.'
                helpString += '\n/traitor (displayName) - Adds user to traitor role and removes from people role.'
                helpString += '\n/help - Help menu.'
                receivedMessage.channel.send(helpString)
            }
            else {
                receivedMessage.channel.send('', {files: ['https://i.imgflip.com/2xoads.jpg']})
            }
        break
        default:
    }
    // Ping
    /*
    if(receivedMessage.content == 'ping') {
        receivedMessage.channel.send('pong')
    }
    */
})
client.login(token)