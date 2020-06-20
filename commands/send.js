const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var prefix = config.bot.prefix, embed = config.misc.embed;

module.exports = {
    name: 'send',
    description: 'Sends text to the host and saves it to a log file (user veiwable soon)',
    usage: '[text]',
    cooldown: 10,
    async execute(message, args, argsTwo, color) {
        var terms = args.join(" ");
        console.log(`[${message.author.username}]: ${terms}${color.clear}`);
        fs.appendFile('Logs/Send-Command.txt', `\n[${message.author.username}]: ${terms}`, function (err) {
            if (err) throw err;
            console.log(`${color.Bgreen}[Success] Sent Item Logged to logfile${color.clear}`);
        });
        const sendEmbed = new MessageEmbed()
            .setColor(embed.defaultColor)
            .setAuthor(message.author.username, message.author.displayAvatarURL({
                dynamic: true,
                size: 512,
                format: "png"
            }))
            .setTitle(`You sent "${terms}" to the server`)
            .setFooter(`SpiderBot | ${prefix}help send`)
            .setTimestamp()
        return message.channel.send(`Your message was sucessfully sent to the host; "${terms}"`);
    },
};