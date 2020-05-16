const { Client, MessageEmbed } = require('discord.js');
const { prefix, token, logChannel, botLoginMessage, adminOnly } = require('../config.json');
const savedEmbeds = require('../SpiderBot-Embeds.json');
const fs = require('fs');

module.exports = {
    name: 'embed',
    description: 'Send and embeded message to a channel',
    execute(message, args, client) {
        if (!args.length) {
            return message.channel.send("You did not provide any arguments. " + `Do \`\`\`${prefix}help embed\`\`\``)
        }
            // channel | color | title | description
            var channelid = args[0];
            var channelid = channelid.replace("<", "");
            var channelid = channelid.replace(">", "");
            var channelid = channelid.replace("#", "");
            var color = args[1];
            var title = args[2];
            var desc = args.join(" ");
            var desc = desc.replace(args[0], "");
            var desc = desc.replace(args[1], "");
            var desc = desc.replace(args[2], "");
            const makeembed = new MessageEmbed()
                .setColor('#' + color)
                .setAuthor(message.author.username, message.author.displayAvatarURL({
                    dynamic: true,
                    size: 512,
                    format: "png"
                }))
                .setTitle(title)
                .setDescription(desc)
                .setTimestamp()
                .setFooter(`Spider Bot | Custom Embed`)
            return client.channels.cache.get(channelid).send(makeembed);
    },
};