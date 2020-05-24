const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));

module.exports = {
    name: 'purge',
    description: 'Mass delete messages',
    usage: '[# to delete]',
    admin: true,
    async execute(message, args) {
        const amount = parseInt(args[0]) + 1;
        if (isNaN(amount)) {
            return message.reply('That isnt a valid number');
        } else if (amount <= 1 || amount > 100) {
            return message.reply('Input a number between 1 and 99');
        }
        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('There was an error deleting messages in this channel');
        });
    },
};