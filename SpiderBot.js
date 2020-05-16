// Import Discord.js And Config Stuff
const Discord = require('discord.js');
const client = new Discord.Client();
const { Client, MessageEmbed } = require('discord.js');

// Import Configuration Files
const { prefix, token, logChannel, botLoginMessage, adminOnly } = require('./config.json');
const botConfig = require('./config.json');

// Embeded Messages
const savedEmbeds = require('./SpiderBot-Embeds.json');

// Files Management And Command Files
const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


// When the bot logs in
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	// Bot Status
	client.user.setActivity('Being Developed');
	// Login Embeded Message
	if (botLoginMessage === true) {
		const embed = new MessageEmbed()
    	.setColor('#84FFFB')
		.setTitle(`SpiderBot Logged In`)
		.setAuthor(client.user.tag)
		.setDescription(`Prefix: ${prefix}\nLog Channel: ${logChannel}\nUse Perms: ${adminOnly}`)
		.setTimestamp()
		.setFooter('Logged In');
		return client.channels.cache.get(logChannel).send(embed);
	}
	
});


client.on('message', message => {
	// Message Contains
	if (message.content.includes("School") || message.content.includes("school")) {
			var badword = message.content;
			message.delete()
				.then(message => console.log(`deleted message`))
				.catch(console.error);
			const replaceembed = new MessageEmbed()
				.setColor('#ff0000')
				.setAuthor(message.author.username, message.author.displayAvatarURL({
					dynamic: true,
					size: 512,
					format: "png"
				}))
				.setTitle(badword.replace(/School/g, "Sch\\*\\*l").replace(/school/g, "sch\\*\\*l"))
				.setTimestamp()
				.setFooter(`Spider Bot`);

			return message.channel.send(replaceembed);
		};
	
	// Commands
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	
	if (!client.commands.has(command)) return;
	try {
		client.commands.get(command).execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply(`There was an error trying to execute that command!`);
	}
	/*
    switch (command) {
		
		case 'savedembed': {
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
		}
		
		case 'embed': {
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
		}
		
		case 'mode': {
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
		break
		}
		
        case 'sendterm': {
            console.log(args[0]);
        break
        }
        case 'server': {
		    message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
        break
        }
        case 'user-info': {
		    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
        break
	    }
        case 'kick': {
		    if (!message.mentions.users.size) {
		    	return message.reply('you need to tag a user in order to kick them!');
		    }

		    const taggedUser = message.mentions.users.first();

		    message.channel.send(`You wanted to kick: ${taggedUser.username}`);
        break
	    }
        case 'avatar': {
		    if (!message.mentions.users.size) {
			    return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`);
		    }

		    const avatarList = message.mentions.users.map(user => {
			    return `${user.username}'s avatar: <${user.displayAvatarURL({ dynamic: true })}>`;
		    });

		    message.channel.send(avatarList);
        break
		}
        case 'prune': {
		    const amount = parseInt(args[0]) + 1;

		    if (message.author.id === "523826395801976842") {
			    if (isNaN(amount)) {
			    	return message.reply('that doesn\'t seem to be a valid number.');
			    } else if (amount <= 1 || amount > 100) {
			    	return message.reply('you need to input a number between 1 and 99.');
			    }

			    message.channel.bulkDelete(amount, true).catch(err => {
				    console.error(err);
				    message.channel.send('there was an error trying to prune messages in this channel!');

			    });
		    } else if (message.author.id !== "523826395801976842") {
			    return message.reply('You do not have acces to that command!');
		    }
        break
		}
		case "cal": {
			if (!args.length) {
				return message.channel.send("You did not provide any arguments (this is here to prevent a crash)");
			} else {
				let signs = {
				"add": "+",
				"sub": "-",
				"mul": "x",
				"div": "÷"
				}
				let [operation, operand1, operand2] = args
				operand1 = parseInt(operand1), operand2 = parseInt(operand2)
				let result
				switch (operation.toLowerCase()) {
				case "add": {
					result = operand1 + operand2
					break
				}
				case "sub": {
					result = operand1 - operand2
					break
				}
				case "mul": {
					result = operand1 * operand2
					break
				}
				case "div": {
					result = operand1 / operand2
					break
				}
				default: {
					message.channel.send(`Use "${prefix}help cal" for the proper syntax.`)
					return
				}
			}
			message.channel.send(`${operand1} ${signs[operation.toLowerCase()]} ${operand2} = ${result}`)
		}
		break
		}
        default:
        case 'help': {
		    const embedt = new MessageEmbed()
                .setColor('#000fff')
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
                .setFooter(`Spider Bot Help | -  ${prefix}${args[0]}  -`);
		    if (!args.length) {
		    	const embed = new MessageEmbed()
    		    	.setColor('#000fff')
			    	.setTitle('Commands')
			    	.setURL('https://discord.js.org/')
			    	.setAuthor(message.author.username, message.author.avatarURL)
			    	.setDescription('Bot Commands')
			    	.addFields(
				    	{ name: 'Help', value: `${prefix}help [command]` },
				    	{ name: 'Fun', value: `${prefix}cal \u200B` },
				    	//{ name: 'Moderation', value: 'no commands' },
				    	//{ name: 'Other', value: 'no commands' },
				    )
				    .setTimestamp()
				    .setFooter('Spider Bot Help');
    		    return message.channel.send(embed);
		    } else if (args[0] === 'cal') {
				embedt.setTitle('Commands | Cal')
				embedt.setDescription('Calculation Command Help')
				embedt.addFields(
					{ name: 'Usage', value: '&cal <add|sub|mul|div> <number1> <number2>' },
					{ name: 'Example', value: '&cal' },
					//{ name: 'Moderation', value: 'no commands' },
					//{ name: 'Other', value: 'no commands' },
				)
			return message.channel.send(embedt);
        }
    break
	}
}*/

});

client.login(token);

 