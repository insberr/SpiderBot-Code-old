// Import Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();
const { Client, MessageEmbed, Permissions } = require('discord.js');

// Files Management
const fs = require('fs');

/*
const child_process = require('child_process');
let watcher = fs.watch('config.json', {persistent: false}).on('change', eventType => {
	if (eventType === 'rename') throw "Do not remove, move, or rename the config.json file."
	client.destroy()
	watcher.close()
	child_process.fork(__filename, undefined, {detached: true, stdio: 'inherit'})
	process.exit()
})
*/
/*
fs.watch('config.json', {persistent: false}).on('change', eventType => {
	if (eventType === 'rename') throw "do not remove, move, or rename the config.json file.";
	client.destroy();
	console.log(this);
	child_process.fork(__filename, undefined, {detached: true, stdio: "inherit"});
	process.exit();
});
*/


let config = JSON.parse(fs.readFileSync('config.json')) 
fs.watch('config.json', {persistent: false}).on('change', eventType => {
	if (eventType === 'rename') throw "do not remove, move, or rename the config.json file."
	config = JSON.parse(fs.readFileSync('config.json'))
	console.log(`Config File Reloaded`)
})
console.log(config);

var prefix = config.prefix;
const token = config.token;
var admin = config.admin;
var logs = config.logs;
var embed = config.embed;
// Import Configuration Files
//const { prefix, token, logs, admin, embed } = require('./config.json');
const botConfig = require('./config.json');

// Embeded Messages
const savedEmbeds = require('./SpiderBot-Embeds.json');



// Command File Management
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Command Cooldown
const cooldowns = new Discord.Collection();

// color text in terminal
const color = { 
	'clear': '\x1b[0m',
	'bold': '\x1b[1m',
	'black': '\x1b[30m',
	'red': '\x1b[31m',
	'green': '\x1b[32m',
	'yellow': '\x1b[33m',
	'blue': '\x1b[34m',
	'magenta': '\x1b[35m',
	'cyan': '\x1b[36m',
	'white': '\x1b[37m',
	'Bblack': '\x1b[90m',
	'Bred': '\x1b[91m',
	'Bgreen': '\x1b[92m',
	'Byellow': '\x1b[93m',
	'Bblue': '\x1b[94m',
	'Bmagenta': '\x1b[95m',
	'Bcyan': '\x1b[96m',
	'Bwhite': '\x1b[97m',
};

// Text varuables
const customText = {
	'null': 'placeholder',
};

// When the bot logs in
client.on('ready', () => {
	console.log(`${color.Bcyan}Logged in as ${color.bold}${color.red}${client.user.tag}! \n${color.clear}${color.Bcyan}Admin only: ${color.Bblue}${config.admin.adminOnly} ${color.clear}`);
	// Set Bot Status
	if (!admin.adminOnly) {
		var adminBotStatus = '';
	} else {
		var adminBotStatus = 'The Bot Is Admin Only'
	}
	client.user.setActivity(`Being Developed | Slightly Useable! | ${prefix}help\n${adminBotStatus}`);
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

client.on('guildCreate', guild => {
	console.log(`Bot was added to a new server: ${guild.name}, ID: ${guild.id}, Members: ${guild.memberCount}.`);
});

client.on('guildDelete', guild => {
	console.log(`Bot was removed from ${guild.name}, ID: ${guild.id}`);
})

client.on('message', async message => {
	// If the message is from a bot, ignore it
	if (message.author.bot) return;

	// Ignore messages that arent commands
	if (message.content.indexOf(prefix) !== 0) return;

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
				return message.reply(`You cant use admin commands in the DMs (it crashes the bot)`);
			}
			if (message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) !== true) {
				return message.reply('This command is admin only');
			}
		}
	} else {
		if (message.channel.type !== 'text') {
			return message.reply(`The bot is admin only at the moment: (reason)`)
		}
		if (message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) !== true) {
			return message.reply(`The bot is admin only at the moment: (reason)`);
		}
	}

	// Execute the command
	try {
		command.execute(message, args, argsTwo, color);
	} catch (error) {
		console.error(error);
		message.reply('There was an error executing that command');
	}
});

client.login(token);

 