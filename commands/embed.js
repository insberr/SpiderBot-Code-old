const { Client, MessageEmbed } = require('discord.js');
const { prefix, token, logs, admin, embed} = require('../config.json');
const savedEmbeds = require('../SpiderBot-Embeds.json');
const fs = require('fs');

module.exports = {
    name: 'embed',
    description: 'Send and embeded message to a channel',
    execute(message, args, client) {
        if (!args.length) {
            return message.channel.send("You did not provide any arguments. " + `Do \`\`\`${prefix}help embed\`\`\``)
        }
            // make/use
            var embedType = args[0];
            switch (embedType) {
                // make | channel | color | title <!> description
                case 'make': {
                    if (args[1] === "|") {
                        var channelID = message.channel;
                        var channelID = String(channelID).replace("<", "").replace(">", "").replace("#", "");
                    } else {
                        var channelID = args[1].replace("<", "").replace(">", "").replace("#", "");
                    }
                    if (args[2] === "|") {
                        var color = embed.defaultColor;
                    } else {
                        var color = "#" + args[2];
                    }
                    var title = args[3].replace("|", " ");
                    var desc = args.join(" ");
                    var desc = desc.replace(args[0], "").replace(args[1], "").replace(args[2], "").replace(args[3], "");
                    const makeembed = new MessageEmbed()
                        .setColor(color)
                        .setAuthor(message.author.username, message.author.displayAvatarURL({
                            dynamic: true,
                            size: 512,
                            format: "png"
                        }))
                        .setTitle(title)
                        .setDescription(desc)
                        .setTimestamp()
                        .setFooter(`Spider Bot | Custom Embed`)
                    return client.channels.cache.get(channelID).send(makeembed);
                break
                }
                // use | embedName | embed/file
                case 'use': {
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
                        fs.appendFile('../EmbedRequest.txt', `${savedEmbeds.embedName}`, function(err) {
                            if (err) throw err;
                            console.log('Embed Request Saved');
                        });
                        return message.channel.send(`Here is the json data`, {
                            files: [
                                "../EmbedRequest.txt"
                            ]
                        })
                    }
                }
            }
    },
};