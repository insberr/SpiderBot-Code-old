const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs'); 
var userconfig;
var config = JSON.parse(fs.readFileSync('config.json'));
var embed = config.misc.embed;
userconfig = JSON.parse(fs.readFileSync('commands/usersettings/userconfig.json'));

module.exports = {
    name: 'userconfig',
    aliases: ['user', 'myinfo'],
    description: 'This command is used by users to change their settings (working progress)',
    usage: 'no content yet',
    async execute(message, args) {
        if (args[0] === null) {
            const userConfigInfoEmbed = new MessageEmbed()
            if (userconfig[message.author.username].embed.customColor === '') {
                userConfigInfoEmbed.setColor(embed.defaultColor)
            } else {
                userConfigInfoEmbed.setColor(userconfig[message.author.username].embed.customColor)
            }  
            userConfigInfoEmbed.setAuthor(message.author.username)
            .setTitle(`${message.author.username}'s profile`)
            return message.channel.send(userConfigInfoEmbed); //display user config
        } else if (args[0] === 'edit') {
            if (args[1] === 'embed') {
                const commandUser = message.author;
                const commandChannel = message.channel;
                message.channel.send(`What setting do you want to select\nChoose color: 🖌️\nSet Custom User InfoText: 🇦`)
                    .then(function (message, user) {
                        message.react('🖌️').then(() => message.react('🇦'));
                        // const commandUser = commandUser;
                        const filter = (reaction, user) => {
                            return ['🖌️', '🇦'].includes(reaction.emoji.name) && user.id === commandUser.id;
                        };
                        const collector = message.createReactionCollector(filter, { max: 1, time: 60000, errors: ['time'] });
                        collector.on('collect', (reaction, user) => {
                            console.log(`Collected ${reaction.emoji.name} from ${commandUser.tag}`);
                            if (reaction.emoji.name === '🖌️') {
                                message.channel.send(`Type a hex color`);
                                const collectorM = new Discord.MessageCollector(commandChannel, m => m.author.id === commandUser.id, { max: 1, time: 10000 });
                                //console.log(collectorM)
                                collectorM.on('collect', message => {
                                    if (message.content.includes('#')) {
                                        return message.channel.send("You picked see");
                                    } else {
                                        return message.channel.send("You picked change");
                                    }
                                })
                            }
                        });
                        collector.on('end', collected => {
                            console.log(`Collected ${collected.size} items`);
                        });
                    });
            }
        } else if (args[0] === 'remove' || args[0] === 'delete') {
            if (args[1] === 'embed') {
                return; //add remove thingy
            }
        }
        
    }
}