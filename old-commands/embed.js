const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var admin = config.admin, embed = config.misc.embed;
var savedEmbeds = JSON.parse(fs.readFileSync('SpiderBot-Embeds.json'));

module.exports = {
    name: 'embed',
    description: 'Send and embeded message to a channel (not finished)',
    args: true,
    usage: '[make | use] (channel) (color) [title] | [description]',
    admin: admin.adminCommands.embed,
    async execute(message, args, argsTwo) {
        // make/use
        var embedType = args[0];
        switch (embedType) {
            // make | channel | color | title | description
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
                    var color = args[2];
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
                return message.client.channels.cache.get(channelID).send(makeembed);
            }
            // use | embedName | embed(true)/file(false)
            case 'use': {
                if (args[2] !== "false") {
                    var textOrEmbed = true;
                } else {
                    var textOrEmbed = false;
                }
                // var title = savedEmbeds[args[1]].Title;
                // var color = '#' + savedEmbeds[args[1]].Color;
                // var desc = savedEmbeds[args[1]].Description;
                // var channelID = savedEmbeds[args[1]].Channel;
                if (textOrEmbed === true) {
                    /*fs.readFile('../testEmbed.txt', function(err, data) {
                        return message.channel.send({ embed: data });
                    })
                    */
                    const useembed = new MessageEmbed()
                        .setColor('#' + savedEmbeds[args[1]].Color)
                        .setAuthor(message.author.username, message.author.displayAvatarURL({
                            dynamic: true,
                            size: 512,
                            format: "png"
                        }))
                        .setTitle(savedEmbeds[args[1]].Title)
                        .setDescription(savedEmbeds[args[1]].Description)
                        .setTimestamp()
                        .setFooter(`Spider Bot | Custom Embed`)
                    return message.client.channels.cache.get(savedEmbeds[args[1]].Channel).send(useembed);
                } else if (textOrEmbed === false) {
                    fs.appendFile('../SavedEmbedRequest.txt', `{\n\t"Embed": ${savedEmbeds[args[1]].Color},\n\t"Channel": "${savedEmbeds[args[1]].Channel}",\n\t"Color": "${savedEmbeds[args[1]].Color}",\n\t"Title": "${savedEmbeds[args[1]].Title}",\n\t"Description": "${savedEmbeds[args[1]].Description}"\n}`, function(err) {
                        if (err) throw err;
                        console.log('Embed Request Saved');
                    });
                    return message.channel.send(`Here is the json data`, {
                        files: [
                            "../SavedEmbedRequest.txt"
                        ]
                    })
                } else {
                    return message.channel.send(`Please provide true or false for the last argument`)
                }
            }
        }
        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};