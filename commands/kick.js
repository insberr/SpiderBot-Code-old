const { Client, MessageEmbed } = require('discord.js');
const { prefix, token, logChannel, botLoginMessage, adminOnly } = require('../config.json');
const savedEmbeds = require('../SpiderBot-Embeds.json');
const fs = require('fs');

module.exports = {
    name: 'kick',
    description: 'Kick a user from the server (soon)',
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.reply('You need to tag a user in order to kick them!');
        }
        const taggedUser = message.mentions.users.first();
        return message.channel.send(`You wanted to kick: ${taggedUser.username} (This command is not added yet)`);
    },
};