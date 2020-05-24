const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
const embed = config.embed;

var userconfig = JSON.parse(fs.readFileSync('commands/usersettings/userconfig.json'));

module.exports = {
    name: 'info',
    description: 'Gives info about the server (Work in progress)',
    args: true,
    usage: '[server | user (@user) | bot]\nuser config [config-item] [set]',
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
                    .setFooter(`SpiderBot | Server Info`)
                    .setTimestamp()
                return message.channel.send(serverInfoEmbed);
            }
            case 'user': {
                if (args[1] === 'config') {
                    switch (args[2]) {
                        case 'embed': {
                            message.channel.send(`What setting do you want to select\nChoose color: 🖌️\nSet Custom User InfoText: 🇦`)
                            message.react('🖌️').then(() => message.react('🇦'));
                            const filter = (reaction, user) => {
                                return ['🖌️', '🇦'].includes(reaction.emoji.name) && user.id === message.author.id;
                            };
                            await message.awaitReactions(filter, { max:1, time: 60000, errors: ['time'] })
                                .then(collected => {
                                    const reaction = collected.first();
                                    switch (reaction.emoji.name) {
                                        // User selected color
                                        case '🖌️': {
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
                                            //return message.reply(`Color settings saved`);
                                            break;
                                        }
                                        // User selected custom text
                                        case '🇦': {
                                            return message.reply(`text`);
                                        }
                                    }
                                })
                                .catch(collected => {
                                    return message.channel.send(`Reaction timed out`);
                                })
                            //return message.channel.send('Settings saved, hopefully');
                            break;
                        }
                        case 'set': {
                            return message.channel.send(`Not added yet`)
                        }
                    }
                } else {
                    return;
                }
                if (!message.mentions.users.size) {
                    const member = message.member;
                    user = member.user;
                    const userInfoEmbed = new MessageEmbed()
                        .setColor(embed.defaultColor)
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
                        .addField(`Joined Discord`, `${user.createdAt}`)
                        .addField(`Joined Server`, `${member.joinedAt}`)
                        .addField(`Nickname`, `${member.nickname !== null ? `${member.nickname}` : 'None'}`)
                        .addField(`User Id`, `${message.author.id}`)
                        .addField(`Roles`, `(Doesnt work)`)
                        .addField(`Status`, `${user.presence.status}`)
                        .addField(`Custom Info`, `comming soon`)
                        .setFooter(`SpiderBot | User Info`)
                        .setTimestamp()
                    return message.channel.send(userInfoEmbed);
                    // return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`);
                } else {
                    const member = message.mentions.members.first();
                    const user = member.user;
                    const userInfoEmbed = new MessageEmbed()
                        .setColor(embed.defaultColor)
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
                        .addField(`Joined Discord`, `${user.createdAt}`)
                        .addField(`Joined Server`, `${member.joinedAt}`)
                        .addField(`Nickname`, `${member.nickname !== null ? `${member.nickname}` : 'None'}`)
                        .addField(`User Id`, `${user.id}`)
                        .addField(`Roles`, `(Doesnt work)`)
                        .addField(`Status`, `${user.presence.status}`)
                        .addField(`Custom Info`, `comming soon`)
                        .setFooter(`SpiderBot | User Info`)
                        .setTimestamp()
                    return message.channel.send(userInfoEmbed);
                }
            }
            case 'bot': {
                const botInfoEmbed = new MessageEmbed()
                    .setColor(embed.defaultColor)
                    .setAuthor(message.author.username, message.author.displayAvatarURL({
                        dynamic: true,
                        size: 512,
                        format: "png"
                    }))
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
