// Import Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();
const { Client, MessageEmbed, Permissions } = require('discord.js');

// Import Configuration Files
const { prefix, token, logs, admin, embed } = require('./config.json');
const botConfig = require('./config.json');

// Embeded Messages
const savedEmbeds = require('./SpiderBot-Embeds.json');

// Files Management
const fs = require('fs');

// Command File Management
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Command Cooldown
const cooldowns = new Discord.Collection();



// When the bot logs in
client.on('ready', () => {
	console.log(`\x1b[96mLogged in as \x1b[1;31m${client.user.tag}! \n\x1b[0m\x1b[96mAdmin only: \x1b[34m${admin.adminOnly} \x1b[0m`);
	// Set Bot Status
	client.user.setActivity(`Being Developed | Slightly Useable!\nAdmin Only: ${admin.adminOnly}`);
	// Login Embeded Message
	if (logs.botLoginMessage === true) {
		const botLoginEmbed = new MessageEmbed()
    	.setColor('#84FFFB')
		.setTitle(`SpiderBot Logged In`)
		.setAuthor(client.user.tag)
		.setDescription(`Prefix: ${prefix}\nLog Channel: ${logs.logChannel}\nUse Perms: ${admin.adminOnly}`)
		.setTimestamp()
		.setFooter('Logged In');
		return client.channels.cache.get(logs.logChannel).send(botLoginEmbed);
	}
	
});


client.on('message', message => {
	// If message contains school (since school is a bad word for a while)
	if (message.content.includes("School") || message.content.includes("school")) {
		client.commands.get('school').execute(message);
	};
	
	// Commands
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Split the arguments of the command
	const args = message.content.slice(prefix.length).split(/ +/);
	const argsTwo = message.content.slice(prefix.length).split('|');
	const commandName = args.shift().toLowerCase();

	

	// See if the command is an alias of another
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	

	// If sure that the command is server only, tell the user
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	// If the command requires arguments, make sure they provided arguments and tell them the command usage
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// Command usage cooldown
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 0) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	

	// Is the config for the bot admin only
	if (!admin.adminOnly) {
		if (command.admin) {
			if (message.channel.type !== 'text') {
				return message.reply(`Cant do in DMs`);
			}
			if (message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) !== true) {
				return message.reply('You need to have admin to use that command');
			}
		}
	} else {
		if (message.channel.type !== 'text') {
			return message.reply(`I cant use commands in the dms at the moment`)
		}
		if (message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) !== true) {
			return message.reply(`The bot is admin only at the moment`);
		}
	}

	// Execute the command
	try {
		command.execute(message, args, argsTwo);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});

client.login(token);

 