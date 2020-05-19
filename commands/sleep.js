const { Client, MessageEmbed } = require('discord.js');
const { prefix, token, logs, admin, embed } = require('../config.json');
const savedEmbeds = require('../SpiderBot-Embeds.json');
const fs = require('fs');

module.exports = {
    name: 'sleep',
    description: 'Set sleep mode',
    // true: sleep false: awake
    execute(message, args, client, botSleep) {
        if (message.author.id !== admin.adminofbot) {
            return message.channel.send(`You do not have permission to use that `);
        } else {
            if (args[0] === 'true') {
                var botSleep = true;
                return message.channel.send('bot is asleep');
            } else if (args[0] === 'false') {
                var botSleep = false;
                return message.channel.send('Bot is no longer asleep');
            } else {
                return message.channel.send(`Please type true or false. Current: ${botSleep}`);
            }
        }
    },
};