const { Client, MessageEmbed } = require('discord.js');
const { prefix, token, logs, admin, embed } = require('../config.json');
const savedEmbeds = require('../SpiderBot-Embeds.json');
const fs = require('fs');

module.exports = {
    name: 'ping', // Command
    aliases: ['icon', 'pfp'], // other ways of using the command
    cooldown: 10, // Adds a cooldown to the command
    description: 'Ping!', // Command description
    guildOnly: true, // Only useable in servers. (cant be used in DMs)
    args: false, // This command needs arguments
    usage: '<make | use | > [channel] [color] | <title> | <description>', // How to use the command
    execute(message, args) {
        message.channel.send('Pong.');
    },
};