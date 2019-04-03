'use strict'

var fs = require('fs')

var raw = fs.readFileSync('./config.json')
var json = JSON.parse(raw);

var version = json.config.build;

module.exports = {
    getBotToken: function () {
        return json.config[version].bot_token
    },
    getGeneralChannel: function() {
        return json.config[version].channels.general
    },
    // Roles
    getPeopleRole: function() {
        return json.config[version].roles.people
    },
    getInsideRole: function() {
        return json.config[version].roles.inside
    },
    getTraitorRole: function() {
        return json.config[version].roles.traitor
    }
};
