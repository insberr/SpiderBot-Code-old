const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
var userconfig;
userconfig = JSON.parse(fs.readFileSync('commands/usersettings/userconfig.json'));

var methods = {};
methods.saveUserConfig = async function (message, data) {
    console.log(data)
    userconfig[data.user.id] = {
        userName: data.user.username,
        userID: data.user.id,
        embed: {
            color: data.embed.color,
            info: data.embed.info
        },
        personal: {
            age: data.personal.age,
            pronouns: data.personal.pronouns,
            bday: data.personal.bday
        }

    }
    fs.writeFileSync('commands/usersettings/userconfig.json', JSON.stringify(userconfig, null, 2), function (err) {
        if (err) throw err;
        console.log(`error`);
    });
};

methods.removeUserConfig = function(data) {
    userconfig[data.user.id] = {
        userName: null,
        userID: null,
        embed: {
            color: null,
            info: null
        },
        personal: {
            age: null,
            pronouns: null,
            bday: null
        }
    }
    fs.writeFileSync('commands/usersettings/userconfig.json', JSON.stringify(userconfig, null, 2), function (err) {
        if (err) throw err;
        console.log(`error`);
    });
}

module.exports = methods;