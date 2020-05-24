const { Client, MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
const admin = config.admin;
const logs = config.logs;
const embed = config.embed;

module.exports = {
    name: 'botconfig',
    aliases: ['bot', 'config'],
    description: 'Configure the bot (working progress)',
    usage: '(admin-only) (true | false)',
    admin: true,
    async execute(message, args) {
        switch (args[0]) {
            case 'admin-only': {
                if (args[1] === 'true') {
                    config.admin.adminOnly = true;
                    let data = JSON.stringify(config, null, 2);
                    fs.writeFileSync('config.json', data, function(err) {
                        if (err) throw err;
                        console.log(`hi`);
                    });
                    //let data = JSON.stringify(configAdmin, null, 2);
                    //fs.writeFileSync('config.json', data);
                    
                    return message.channel.send(`The bot is now admin only`);
                } else if (args[1] === 'false') {
                    config.admin.adminOnly = false;
                    let data = JSON.stringify(config, null, 2);
                    fs.writeFileSync('config.json', data, function(err) {
                        if (err) throw err;
                        console.log(`hi`);
                    });
                    //let data = JSON.stringify(configAdmin, null, 2);
                    //fs.writeFileSync('config.json', data);
                    
                    return message.channel.send(`The bot is no longer admin only`);
                }
                break;
            }
            default: {
                const configInfoEmbed = new MessageEmbed()
                    .setColor(embed.defaultColor)
                    .setAuthor(message.author.username)
                    .addFields([
                        { title: 'Admin Only', value: admin.adminOnly },
                        { title: 'Log Channel', value: logs.logChannel },
                    ])
                    .setFooter('SpiderBot')
                    .setTimestamp()
                return message.channel.send(configInfoEmbed)
            }
        }
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