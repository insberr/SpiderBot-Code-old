const { Client, MessageEmbed } = require('discord.js');
const { prefix, token, logChannel, botLoginMessage, adminOnly } = require('../config.json');
const savedEmbeds = require('../SpiderBot-Embeds.json');
const fs = require('fs');

module.exports = {
    name: 'sendterm',
    description: 'Sends the text after the command to the host (soon,and saves it to a file)',
    execute(message, args) {
        var terms = args.join(" ");
        console.log(`${message.author.username} Sent An Item To The Console: ${terms}`);
        return message.channel.send(`You sent "${terms}" to the server`);
        // Add: Saves to a file
    },
};