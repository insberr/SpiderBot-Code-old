const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs'); 
const si = require('systeminformation');
var config = JSON.parse(fs.readFileSync('config.json'));

module.exports = {
    name: 'activity',
    description: 'set bot status and activity',
    admin: true,
    async execute(message, args) {
        switch(args[0]) {
            case 'set': {
                const sentMessage = await message.channel.send('Confirm - Yes set new activity: ✅ - Cancel: ❌');
                await sentMessage.react('✅');
                await sentMessage.react('❌');
                console.log('reactions done');

                const commandUser = message.author;
                const commandChannel = message.channel;
                console.log('vars set');
                const filter = (reaction, user) => {
                    console.log('something');
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === commandUser.id;
                };
                const collector = sentMessage.createReactionCollector(filter, { max: 1, time: 60000, errors: ['time'] });
                collector.on('collect', (reaction, user) => {
                    console.log(`Collected ${reaction.emoji.name} from ${commandUser.tag}`);
                    if (reaction.emoji.name === '✅') {
                        message.channel.send(`Type a new bot status`);
                        const collectorM = new Discord.MessageCollector(commandChannel, m => m.author.id === commandUser.id, { max: 1, time: 120000 });
                        //console.log(collectorM)
                        collectorM.on('collect', message => {
                            const newStatus = message.content;
                            message.client.user.setActivity(newStatus);
                            return message.channel.send(`New status set to ${newStatus}`);
                        })
                    }
                });
                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} items`);
                });
                console.log('ended');
                break;
            }
            case 'default': {
                //reenable
                break;
            }
            default: {
                return message.channel.send('bot status is currently: not added');
            }
        }
    }
}