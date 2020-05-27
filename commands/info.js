const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var embed = config.misc.embed;

var userconfig = JSON.parse(fs.readFileSync('commands/usersettings/userconfig.json'));

module.exports = {
    name: 'info',
    description: 'Gives info about the server (Work in progress)',
    args: true,
    usage: '[server | user (@user) | bot]\n',
    async execute(message, args) {
        var userConfig = userconfig[message.author.username];
        //var memberConfig = userconfig[message.mentions.members.first()];
        const infoType = args[0];
        switch (infoType) {
            case 'server': {
                const serverInfoEmbed = new MessageEmbed()
                    .setColor(userConfig.embed.customColor || embed.defaultColor)
                    .setAuthor(message.author.username, message.author.displayAvatarURL({
                        dynamic: true,
                        size: 512,
                        format: "png"
                    }))
                    .setTitle(`${message.guild.name} Server Info`)
                    .addField(`**Coming soon**`)
                    .setFooter(`SpiderBot | Server Info`)
                    .setTimestamp()
                return message.channel.send(serverInfoEmbed);
            }
            case 'user': {
                if (!message.mentions.users.size) {
                    const member = message.member;
                    var user = member.user;
                    const userInfoEmbed = new MessageEmbed()
                        .setColor(userConfig.embed.customColor || embed.defaultColor)
                        .setAuthor(message.author.username, message.author.displayAvatarURL({
                            dynamic: true,
                            size: 512,
                            format: "png"
                        }))
                        .setThumbnail(message.author.displayAvatarURL({
                            dynamic: true,
                            size: 512,
                            format: "png"
                        }))
                        .setTitle(`${message.author.username}'s Info`)
                        .addField(`**Joined Discord**`, `${user.createdAt}`)
                        .addField(`**Joined Server**`, `${member.joinedAt}`)
                        .addField(`**Nickname**`, `${member.nickname !== null ? `${member.nickname}` : 'None'}`)
                        .addField(`**User Id**`, `${message.author.id}`)
                        .addField(`**Roles**`, `${member.roles.cache.map(r => `<@&${r.id}>`).join('\n')}`)
                        .addField(`**Status**`, `${user.presence.status}`)
                        .addField(`**Custom Info**`, `**Info**: ${userConfig.embed.customInfo}\n**Embed Color**: ${userConfig.embed.customColor}\n**Age**: ${userConfig.personal.age} - **BirthDay**: ${userConfig.personal.bday}\n**Pronouns**: ${userConfig.personal.pronouns}`)
                        .setFooter(`SpiderBot | User Info`)
                        .setTimestamp()
                    return message.channel.send(userInfoEmbed);
                    // return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`);
                } else {
                    const member = message.mentions.members.first();
                    const user = member.user;
                    const userInfoEmbed = new MessageEmbed()
                        .setColor(userConfig.embed.customColor || embed.defaultColor)
                        .setAuthor(message.author.username, message.author.displayAvatarURL({
                            dynamic: true,
                            size: 512,
                            format: "png"
                        }))
                        .setThumbnail(user.displayAvatarURL({
                            dynamic: true,
                            size: 512,
                            format: "png"
                        }))
                        .setTitle(`${user.tag}'s Info`)
                        .addField(`**Joined Discord**`, `${user.createdAt}`)
                        .addField(`**Joined Server**`, `${member.joinedAt}`)
                        .addField(`**Nickname**`, `${member.nickname !== null ? `${member.nickname}` : 'None'}`)
                        .addField(`**User Id**`, `${user.id}`)
                        .addField(`**Roles**`, `${member.roles.cache.map(r => `<@&${r.id}>`).join('\n')}`)
                        .addField(`**Status**`, `${user.presence.status}`)
                        .addField(`**Custom Info**`, `comming soon`)
                        .setFooter(`SpiderBot | User Info`)
                        .setTimestamp()
                    return message.channel.send(userInfoEmbed);
                }
            }
            case 'bot': {
                const botInfoEmbed = new MessageEmbed()
                    .setColor(userconfig[message.author.username].embed.customColor || embed.defaultColor)
                    .setAuthor(message.author.username, message.author.displayAvatarURL({
                        dynamic: true,
                        size: 512,
                        format: "png"
                    }))
                    .setTitle('SpiderBot`s info')
                    .addField('**Comming soon**', 'I said soon')
                    .setFooter('SpiderBot Info')
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


         /*
                                        message.channel.send(`Type a hex color`).then(() => {
                                            const filter = m => message.author.id === m.author.id;
                                            message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                                                .then(messages => {
                                                    if (!messages.first().content.includes('#')) {
                                                        message.channel.send(`Please use a hex color: EX: #123abc`);
                                                    }
                                                    userconfig[message.author.username].embed.customColor = messages.first().content;
                                                    let data = JSON.stringify(userconfig, null, 2);
                                                    fs.writeFileSync('commands/usersettings/userconfig.json', data, function(err) {
                                                        if (err) throw err;
                                                        console.log(`hi`);
                                                    });
                                                    return message.channel.send(`Color Changed to ${messages.first().content} successfully`);
                                                })
                                                .catch(() => {
                                                    return message.channel.send(`You didnt enter any input`);
                                                })
                                            })
                                        //return message.reply(`Color settings saved`); */
    },
};
