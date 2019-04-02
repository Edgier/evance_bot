'use strict'

var fs = require('fs')

var raw = fs.readFileSync('./config.json')
var json = JSON.parse(raw);

module.exports = {
    getBotToken: function () {
        return json.config.bot_token
    },
    getGeneralChannel: function() {
        return json.config.channels.general
    }
};

var http = require("http");
setInterval(function() {
    http.get("https://evance-discord-bot.herokuapp.com/");
}, 300000); // every 5 minutes (300000)