const { Client, MessageEmbed } = require('discord.js');
const { prefix, token, logChannel, botLoginMessage, adminOnly } = require('../config.json');
const savedEmbeds = require('../SpiderBot-Embeds.json');
const fs = require('fs');

module.exports = {
    name: 'purge',
    description: 'Mass delete messages',
    admin: true,
    async execute(message, args) {
        const amount = parseInt(args[0]) + 1;
        if (message.author.id === "523826395801976842") {
            if (isNaN(amount)) {
                return message.reply('that doesn\'t seem to be a valid number.');
            } else if (amount <= 1 || amount > 100) {
                return message.reply('you need to input a number between 1 and 99.');
            }
                message.channel.bulkDelete(amount, true).catch(err => {
                    console.error(err);
                    message.channel.send('there was an error trying to prune messages in this channel!');
                });
        } else if (message.author.id !== "523826395801976842") {
            return message.reply('You do not have acces to that command!');
        }
    },
};