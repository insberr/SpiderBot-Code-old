const { Client, MessageEmbed } = require('discord.js');
const { prefix, token, logChannel, botLoginMessage, adminOnly } = require('../config.json');
const savedEmbeds = require('../SpiderBot-Embeds.json');
const fs = require('fs');

module.exports = {
    name: 'botconfig',
    description: 'Configure the bot (comming soon)',
    execute(message, args) {
        return message.channel.send(`This command is coming soon`)
        /*
        if (!args.length) {
            return message.channel.send('You didnt provide any argumets');
        } else if (args[0] === 'sleep') {
            var mode = 'sleep'
            return message.channel.send('Sleepy Bot Time');
        } else if (args[0] === 'wake') {
            var mode = 'wake'
            return message.channel.send('Waking Bot');
        } else {
            return message.channel.send('You didnt provide the correct argumets');
        }
        */
    },
};