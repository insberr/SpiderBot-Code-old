const { Client, MessageEmbed } = require('discord.js');
const { bot, prefix, token, logs, admin, embed } = require('../config.json');
const savedEmbeds = require('../SpiderBot-Embeds.json');
const fs = require('fs');

module.exports = {
    name: 'sleep',
    description: 'Set sleep mode',
    admin: true,
    // true: sleep false: awake
    execute(message, args) {
        if (args[0] === 'true') {
            var botSleep = true;
            return message.channel.send('bot is asleep');
        } else if (args[0] === 'false') {
            var botSleep = false;
            return message.channel.send('Bot is no longer asleep');
        } else {
            return message.channel.send(`Please type true or false. Current: ${botSleep}`);
        }
    },
};