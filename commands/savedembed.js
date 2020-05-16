const { Client, MessageEmbed } = require('discord.js');
const { prefix, token, logChannel, botLoginMessage, adminOnly } = require('../config.json');
const savedEmbeds = require('../SpiderBot-Embeds.json');
const fs = require('fs');

module.exports = {
    name: 'savedembed',
    description: 'Get a saved embed and send it!',
    execute(message, args, client) {
        if (!args.length) {
            return message.channel.send(`You did not provide any arguments. Use \`\`\`${prefix}help savedembed\`\`\``)
        }
        // embed name | embed? 
        var textOrEmbed = args[1];
        var title = savedEmbeds[args[0]].Title;
        var color = savedEmbeds[args[0]].Color;
        var desc = savedEmbeds[args[0]].Description;
        var channelid = savedEmbeds[args[0]].Channel;
        if (textOrEmbed === "true") {
            const useembed = new MessageEmbed()
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
            return client.channels.cache.get(channelid).send(useembed);
        } else if (textOrEmbed === "false") {
            fs.appendFile('./EmbedRequest.txt', `${savedEmbeds.embedName}`, function (err) {
                if (err) throw err;
                console.log('Embed Request Saved');
            });
            return message.channel.send(`Here is the json data`, {
                files: [
                    "./EmbedRequest.txt"
                ]
            })
        }
    },
};