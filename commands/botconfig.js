const { Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'botconfig',
    aliases: ['bot', 'config'],
    description: 'Configure the bot (comming soon)',
    usage: 'null',
    args: true,
    admin: true,
    async execute(message, args) {
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