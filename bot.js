const Discord = require('discord.js')
const client = new Discord.Client()

var config = require('./config.js')

let token = config.getBotToken()
let general_channel_id = config.getGeneralChannel()


client.on('ready', () => {

})
client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }
    // Commands
    switch(receivedMessage.content) {
        case '/channels':
            client.guilds.forEach((guild) => {
                guild.channels.forEach((channel) => {
                    receivedMessage.channel.send(channel.id)
                })
            })
        break;
        default:
    }
    if(receivedMessage.content == 'ping') {
        receivedMessage.channel.send('pong')
    }
})
client.on('guildMemberAdd', (guild, user) => {

})
client.login(token)