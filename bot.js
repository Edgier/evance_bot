const Discord = require('discord.js')
const client = new Discord.Client()

var config = require('./config.js')

var token = config.getBotToken()
var general_channel_id = config.getGeneralChannel()


client.on('ready', () => {

})
client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    } 
    if(receivedMessage.content == 'ping') {
        receivedMessage.channel.send('pong pong')
    }
})
client.login(token)
