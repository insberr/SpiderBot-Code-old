const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var logs = config.logs;

module.exports = {
    name: 'stop', // Command
    description: 'Stops the bot', // Command description
    usage: '(reason)',
    admin: true,
    async execute(message, args) {
        const stopEmbed = new MessageEmbed()
            .setColor('#84FFFB')
            .setTitle(`The bot was stopped by ${message.author.username}`)
            .setDescription(`Reason: ${args.join(' ')}`)
            .setTimestamp()
        await message.client.user.setStatus('offline');
        await message.client.channels.cache.get(logs.logChannel).send(stopEmbed);
        console.log(`${message.author.username} shut down the bot: ${args.join(' ')}`)
        await message.client.destroy();
        return process.exit();
    },
};