const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const { Client, MessageEmbed } = require('discord.js');


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
		const embed = new MessageEmbed()
    	.setColor('#84FFFB')
			.setTitle('SpiderBot Logged In')
			.setAuthor(client.user.tag)
			.setDescription('\u200B')
			.setTimestamp()
			.setFooter('Logged In');
	client.channels.cache.get('699835374574370836').send(embed);
});


client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

    switch (command) {
        case 'sendterm': {
            console.log(args[0]);
        break
        }
	    case 'ping': {
		    message.channel.send('Pong.');
        break
        }
        case 'add': {
            if (!args.length) {
		    	return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		    } else {
                var sol = parseInt(args[0]) + parseInt(args[1]);
                return message.channel.send(`${args[0]} + ${args[1]} = ${sol}`);
            }
        break
	    }
        case 'beep': {
		    message.channel.send('Boop.');
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
        case 'info': {
		    if (!args.length) {
			    return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		    } else if (args[0] === 'foo') {
		    	return message.channel.send('bar');
		    }

		    message.channel.send(`First argument: ${args[0]}`);
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
        default:
        case 'help': {
		    const embedt = new MessageEmbed()
                .setColor('#000fff')
                .setAuthor(message.author.username)
                .setTimestamp()
                .setFooter(`Spider Bot Help | -  ${prefix}${args[0]}  -`);
		    if (!args.length) {
		    	const embed = new MessageEmbed()
    		    	.setColor('#000fff')
			    	.setTitle('Commands')
			    	.setURL('https://discord.js.org/')
			    	.setAuthor(message.author.username)
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
}});

client.login(token);

