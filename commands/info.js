const { Client, MessageEmbed } = require('discord.js');
const { embed } = require('../config.json');

module.exports = {
    name: 'info',
    description: 'Gives info about the server (Work in progress)',
    args: true,
    usage: '[server | user (@user) | bot]',
    async execute(message, args) {
        const infoType = args[0];
        switch (infoType) {
            case 'server': {
                const serverInfoEmbed = new MessageEmbed()
                    .setColor(embed.defaultColor)
                    .setAuthor(message.author.username, message.author.displayAvatarURL({
                        dynamic: true,
                        size: 512,
                        format: "png"
                    }))
                    .setTitle(`${message.guild.name} Server Info`)
                    .addField(`(comming soon)`)
                    .setFooter(`SpiderBot Embeds | Null`)
                    .setTimestamp()
                return message.channel.send(serverInfoEmbed);
            }
            case 'user': {
                if (!message.mentions.users.size) {
                    const userInfoEmbed = new MessageEmbed()
                        .setColor(embed.defaultColor)
                        .setAuthor(`Null`)
                        .setTitle(`Your User Info`)
                        .addField(`Null`)
                        .setFooter(`SpiderBot Embeds | Null`)
                        .setTimestamp()
                    return message.channel.send(userInfoEmbed);
                    // return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`);
                }
                const userToGetInfoFor = message.mentions.members.first();
                const userInfoEmbed = new MessageEmbed()
                    .setColor(embed.defaultColor)
                    .setAuthor(`Null`)
                    .setTitle(`User Info For ${userToGetInfoFor.username}`)
                    .addField(`Null`)
                    .setFooter(`Null`)
                    .setTimestamp()
                return message.channel.send(userInfoEmbed);
            }
            case 'bot': {
                const botInfoEmbed = new MessageEmbed()
                    .setColor()
                    .setAuthor()
                    .setTitle()
                    .addField()
                    .setFooter()
                    .setTimestamp()
                return message.channel.send(botInfoEmbed);
            }
        }
        // message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
        // User Info: message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
        /* in user info give avatar
        if (!message.mentions.users.size) {
			    return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`);
		    }

		    const avatarList = message.mentions.users.map(user => {
			    return `${user.username}'s avatar: <${user.displayAvatarURL({ dynamic: true })}>`;
		    });

            message.channel.send(avatarList);
        */
    },
};
