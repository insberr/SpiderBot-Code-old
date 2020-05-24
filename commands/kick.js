const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));
const prefix = config.prefix;
const logs = config.logs;
const embed = config.embed;

module.exports = {
    name: 'kick',
    description: 'Kick a user from the server',
    usage: '[@user] (reason)',
    args: true,
    admin: true,
    async execute(message, args, argsTwo) {
        // The reason for the kick
        const reasonForKick = args.join(' ').replace(args[0], '');
        // Make sure a user was tagged
        if (!message.mentions.members.size) {
            return message.reply('You need to tag a user in order to kick them!');
        }
        // Get the tagged user
        const userToKick = message.mentions.members.first();
        
        // DM the kicked user the reason they are being kicked
        const kickedUserDM = new MessageEmbed()
            .setColor(embed.defaultColor)
            .setAuthor(message.author.username)
            .setTitle(`Kicked From ${message.guild.name}`)
            .setDescription(`${message.author.username} Kicked You From ${message.guild.name}\nReason: ${reasonForKick}`)
            .setFooter(`SpiderBot | Kick`)
            .setTimestamp()
        await (await userToKick.createDM()).send(kickedUserDM);
        // Log the kick to the console
        console.log(`Kick: \x1b[31m${userToKick} was kicked from the server by ${message.author.username}`)
        // Make the bot-log embed
        const kickLogEmbed = new MessageEmbed()
            .setColor(embed.defaultColor)
            .setAuthor(message.author.username)
            .setTitle(`User Kicked`)
            .setDescription(`${message.author.username} kicked ${userToKick}\nReason: ${reasonForKick}`)
            .setFooter(`SpiderBot | ${prefix}help kick`)
            .setTimestamp()
        message.client.channels.cache.get(logs.logChannel).send(kickLogEmbed);
        userToKick.kick(reasonForKick);
    },
};