const { Client, MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
var config;
var config = JSON.parse(fs.readFileSync('config.json'));
var admin = config.admin;
var logs = config.logs
var embed = config.misc.embed;

module.exports = {
    name: 'botconfig',
    aliases: 'config',
    description: 'Configure the bot (working progress)',
    usage: '(admin-only) (true | false)',
    admin: true,
    async execute(message, args) {
        switch (args[0]) {
            case 'admin-only': {
                if (args[1] === 'true') {
                    config.admin.adminOnly = true;
                    message.channel.send(`Admin only mode set to ${args[1]}`);
                } else if (args[1] === 'false') {
                    config.admin.adminOnly = false;
                    message.channel.send(`Admin only mode set to ${args[1]}`)
                } else {
                    return message.channel.send(`You did not provide 'true' or 'false'`);
                }
                
                break;
            }
            default: {
                const configInfoEmbed = new MessageEmbed()
                    .setColor(embed.defaultColor)
                    .setAuthor(message.author.username)
                    .addField('Admin Only', admin.adminOnly)
                    .addField('Log Channel', logs.logChannel)
                    .setFooter('SpiderBot')
                    .setTimestamp()
                return message.channel.send(configInfoEmbed)
            }
        } 
    },
};

fs.writeFileSync('config.json', JSON.stringify(config, null, 2), function(err) {
    if (err) throw err;
    console.log(`There was an error changing the config.json`);
});