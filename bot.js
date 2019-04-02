const Discord = require('discord.js')
const client = new Discord.Client()

var config = require('./config.js')

var token = config.getBotToken()
var general_channel_id = config.getGeneralChannel()


client.on('ready', () => {
    // List servers the bot is connected to
    console.log("Servers:")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)

        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
    })
})
client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    } 
    if(receivedMessage.content == 'ping') {
        receivedMessage.channel.send('pong')
    }
})
client.login(token)
