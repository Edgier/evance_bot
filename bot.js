const Discord = require('discord.js')
const client = new Discord.Client()

var config = require('./config.js')

var token = config.getBotToken()
var general_channel_id = config.getGeneralChannel()


client.on('ready', () => {
    // List servers the bot is connected to
    var http = require("http");
    setInterval(function() {
        http.get("https://evance-discord-bot.herokuapp.com/");
    }, 300000); // every 5 minutes (300000)
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
