/* eslint-disable no-inner-declarations */
/** Import Discord.js and the other needed modules */

const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const winston = require('winston');
require('dotenv').config();

const client = new CommandoClient({
	commandPrefix: '&',
	owner: '523826395801976842',
	invite: 'https://discord.gg/6kFYJAP',
})

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'log' }),
	],
	format: winston.format.printf(log => `[${log.level.toUpperCase()}] ${log.message}`),
});


const sqlite = require('sqlite');
client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);


client.registry
	.registerDefaultTypes()
	.registerGroups([
		['config', 'Edit the bots config'],
		['moderation', 'Moderation commands'],
		['info', 'User info/configuration, leveling, and more'],
		['fun', 'Fun commands'],
		['economy', 'Economy game (in dev)'],
		['developement', 'Developement commands'],
		['testing', 'Commands being developed'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	/*
	.registerDefaultCommands({
		help: false,
	})
	*/
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	logger.log('info', `Logged in as ${client.user.tag}`);
	client.user.setActivity('with Commando');
});

client.on('error', m => logger.log('error', m));


require('colors')
// const client = new Discord.Client({ particls: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const { Client, MessageEmbed, Permissions } = require('discord.js');
// File Management And System Info
const fs = require('fs');

// My functions 
const functions = require('./functions.js');
var token = process.env.BOT_TOKEN;
/** Configuration: File refresh on changes. Set config variables */

// Set the config files to a variable
let config = JSON.parse(fs.readFileSync('config.json'));
let userconfig = JSON.parse(fs.readFileSync('old-commands/usersettings/userconfig.json'));

// If there is a change in the config.json file, reload it
fs.watch('config.json', { persistent: false }).on('change', eventType => {
	if (eventType === 'rename') throw "do not remove, move, or rename the config.json file.";
	config = JSON.parse(fs.readFileSync('config.json'));
	console.log(`Config Files Reloaded`);
	// Reset the config varuables
	let { bot, admin, logs, misc } = config, { activities, prefix } = bot, { embed, customText } = misc;

});
let { bot, admin, logs, misc } = config, { activities, prefix } = bot, { embed, customText } = misc;


// Reload user-config
fs.watch('old-commands/usersettings/userconfig.json', { persistent: false }).on('change', eventType => {
	if (eventType === 'rename') throw "do not remove, move, or rename the userconfig.json file.";
	userconfig = JSON.parse(fs.readFileSync('old-commands/usersettings/userconfig.json'));
	console.log(`UserConfig Files Reloaded`);
});


/* Command files management */

// Command Cooldown
/*
const cooldowns = new Discord.Collection();

// Command File Management
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
*/

/* Console text formatting variables */
const color = functions.color;


/* Misc 'on ready' variables */
// This counts the number of times the bot is started
config.bot.startups++;

/* When the client (bot) is ready
client.on('ready', () => {
	functions.botStartUp(client, config, color);
});
*/
// When the bot is added to a server
client.on('guildCreate', guild => {
	console.log(`Bot was added to a new server: ${guild.name}, ID: ${guild.id}, Members: ${guild.memberCount}.`);
});

// When the bot leaves a server
client.on('guildDelete', guild => {
	console.log(`Bot was removed from ${guild.name}, ID: ${guild.id}`);
})

// When there is a message in a channel
client.on('message', async message => {
	if (message.author.bot) return;
	functions.swearFilter(message, s => {
		if (s.swearing) message.channel.send({ embed: { title: `Please do not use such offensive words` } });
		// console.log(s);
	})
	functions.commandUse(client, message, config, userconfig, color, cmd => {
		// console.log(' ')
	});
	/*
	// let userFromGuild = message.client.users.fetch(message.author.id);

	// If the message does not have the prefix, ignore. Test if the user is a bot and ignore
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// if dms return
	if (message.channel.type !== 'text') return message.channel.send('You can not use the bot in the DMs.');



	// Split the arguments
	const args = message.content.slice(prefix.length).split(/ +/);
	const argsTwo = message.content.slice(prefix.length).split('|');
	const commandName = args.shift().toLowerCase();

	// Get the used commands alieses
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// Check if the command is guild only and if the user is using it in a guild
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply({ embed: { color: userconfig[message.author.username].embed.customColor || embed.defaultColor, title: `You can't use server only commands in the DMs! ` }});
	}

	// Check if the command requires arguments. If required, and no were provided, tell the user the usage
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments,`;
		if (command.usage) {
			reply += `\nThe commands usage is: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send({ embed: { color: userconfig[message.author.username].embed.customColor || embed.defaultColor, title: reply }});
	}

	// Command usage cooldown (im not even going to pretend to know how this works)
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
			return message.reply({ embed: { color: userconfig[message.author.username].embed.customColor || embed.defaultColor, title: `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.` }});
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	

	// Test if the bot is admin only, test if command is admin only
	if (!admin.adminOnly) {
		if (command.admin) {
			if (message.channel.type !== 'text') {
				return message.reply({ embed: { color: userconfig[message.author.username].embed.customColor, title: `You cant use admin commands in the DMs (it crashes the bot, which is better than people being able to use them in DMs)` }});
			}
			if (message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) !== true) {
				return message.channel.send({ embed: { color: userconfig[message.author.username].embed.customColor, title: 'That command is admin only' }});
			}
		}
	} else {
		if (message.channel.type !== 'text' || message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) !== true) {
			return message.channel.send({ embed: { color: userconfig[message.author.username].embed.customColor || embed.defaultColor, title: `The bot is admin only at the moment: ${admin.adminOnlyReason}` }})
		}
	}

	// Execute the command
	try {
		command.execute(message, args, argsTwo, color);
	} catch (error) {
		console.error(error);
		message.channel.send({ embed: { color: userconfig[message.author.username].embed.customColor || embed.defaultColor, title: `There was an error using ${command}\nArgs: ${args.join(' ')}` }});
	}
	*/
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.particl) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message', error);
			return;
		}
	}
	//console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction`);
	//console.log(`${reaction.count} user(s) have given the same reaction to this message`)
})

// Newly defined config is set with htis
fs.writeFileSync('config.json', JSON.stringify(config, null, 2), function (err) {
	if (err) throw err;
	console.log(`error`);
});

client.login(token);

