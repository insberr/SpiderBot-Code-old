const { Client, MessageEmbed } = require('discord.js');
const { prefix, token, logChannel, botLoginMessage, adminOnly } = require('../config.json');


module.exports = {
    name: 'send',
    admin: true,
    description: 'Sends the text after the command to the host (soon,and saves it to a file)',
    async execute(message, args) {
        var terms = args.join(" ");
        console.log(`${message.author.username} Sent An Item To The Console: '${terms}'`);
        return message.channel.send(`You sent "${terms}" to the server`);
        // Add: Saves to a file
    },
};