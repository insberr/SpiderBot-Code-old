const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
var userconfig;
userconfig = JSON.parse(fs.readFileSync('commands/usersettings/userconfig.json'));
var config = JSON.parse(fs.readFileSync('config.json'));
var embed = config.misc.embed;

const functions = require('../functions.js');

module.exports = {
    name: 'userconfig',
    aliases: ['user', 'myinfo'],
    description: 'This command is used by users to change their settings (working progress)',
    usage: 'no content yet',
    async execute(message, args) {
        userconfig = JSON.parse(fs.readFileSync('commands/usersettings/userconfig.json'));
        var userConfig;
        userConfig = userconfig[message.author.id] || userconfig.default;

        var changes;
        changes = {
            user: {
                username: message.author.username,
                id: message.author.id
            },
            embed: {
                color: userConfig.embed.color,
                info: userConfig.embed.info
            },
            personal: {
                age: userConfig.personal.age,
                pronouns: userConfig.personal.pronouns,
                bday: userConfig.personal.bday
            }
        }

        if (!args[0]) {
            const userConfigInfoEmbed = new MessageEmbed()
                .setColor(userConfig.embed.customColor)
                .setAuthor(message.author.username)
                .setTitle(`${message.author.username}'s profile`)
            return message.channel.send(userConfigInfoEmbed)
        } else if (args[0] === 'edit') {
            switch (args[1]) {
                case 'embed': {
                    const commandUser = message.author;
                    const commandChannel = message.channel;
                    message.channel.send(`What setting do you want to select\nCustom color: 🖌️\nSet Custom User InfoText: 🇦`).then(function (message, user) {
                        message.react('🖌️').then(() => message.react('🇦'));
                        // const commandUser = commandUser;
                        const filter = (reaction, user) => {
                            return ['🖌️', '🇦'].includes(reaction.emoji.name) && user.id === commandUser.id;
                        };
                        const collector = message.createReactionCollector(filter, { max: 1, time: 60000, errors: ['time'] });
                        collector.on('collect', (reaction, user) => {
                            // console.log(`Collected ${reaction.emoji.name} from ${commandUser.tag}`);
                            if (reaction.emoji.name === '🖌️') {
                                message.channel.send(`Enter a hex color`).then(function () {
                                    const collectorM = new Discord.MessageCollector(commandChannel, m => m.author.id === commandUser.id, { max: 1, time: 60000 });
                                    collectorM.on('collect', message => {
                                        if (message.content.includes('#')) {
                                            changes.embed.color = message.content;
                                            functions.saveUserConfig(message, changes);
                                            return message.channel.send(`Color set to ${message.content}`);
                                        } else {
                                            return message.channel.send(`Type a valid hex color. Ex: #267323`);
                                        }
                                    })
                                })
                            } else if (reaction.emoji.name === '🇦') {
                                message.channel.send({ embed: { title: `Type your bio`, color: userConfig.embed.color } }).then(function () {
                                    const collectorM = new Discord.MessageCollector(commandChannel, m => m.author.id === commandUser.id, { max: 1, time: 120000 });
                                    //console.log(collectorM)
                                    collectorM.on('collect', message => {
                                        changes.embed.info = message.content;
                                        functions.saveUserConfig(message, changes);
                                        return message.channel.send(`Custom text set to ${message.content}`);
                                    })
                                })
                            }
                        });
                        collector.on('end', collected => {
                            // console.log(`Collected ${collected.size} items`);
                        });
                    });
                    break;
                }
                case 'info': {
                    const commandUser = message.author;
                    const commandChannel = message.channel;

                    message.channel.send({ embed: { title: 'What do you want to edit? (age ... ... )' } }).then(function () {
                        const messageCollector = new Discord.MessageCollector(commandChannel, m => m.author.id === commandUser.id, { max: 1, time: 1000000 });
                        messageCollector.on('collect', message => {
                            switch (message.content) {
                                case 'age': {
                                    message.channel.send('Enter your age or type exit to cancel').then(function () {
                                        const ageCollector = new Discord.MessageCollector(commandChannel, m => m.author.id === commandUser.id, { max: 1, time: 1000000 });
                                        ageCollector.on('collect', message => {
                                            if (message.content.includes('exit')) {
                                                return message.channel.send('Exited');
                                            } else {
                                                changes.personal.age = message.content;
                                                functions.saveUserConfig(message, changes);
                                                return message.channel.send(`Your age was set to ${message.content}`)
                                            }
                                        })
                                    })
                                }
                            }
                        })
                    })
                }
            }
        } else if (args[0] === 'remove' || args[0] === 'delete') {
            const commandUser = message.author;
            const commandChannel = message.channel;
            message.channel.send({ embed: { title: `Are you sure? Type yes to delete all user data. Type no to cancel.`, color: userConfig.embed.color } }).then(function () {
                const confirm = new Discord.MessageCollector(commandChannel, m => m.author.id === commandUser.id, { max: 1, time: 1000000 });
                confirm.on('collect', message => {
                    if (message.content === 'yes') {
                        functions.removeUserConfig(changes);
                        return message.channel.send(`User data was deleted`)
                    }
                })
            })
        }
    }
}