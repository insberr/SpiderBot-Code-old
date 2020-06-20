/* eslint-disable no-inner-declarations */
/** Import Discord.js and the other needed modules */
const Discord = require('discord.js');
const client = new Discord.Client({ particls: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const { Client, MessageEmbed, Permissions } = require('discord.js');
// File Management And System Info
const fs = require('fs');
const si = require('systeminformation');

/** Configuration: File refresh on changes. Set config variables */
// Ready config variables
// var bot, activities, prefix, token, admin, logs, embed, customText;

// Set the config files to a variable
let config = JSON.parse(fs.readFileSync('config.json'));
let userconfig = JSON.parse(fs.readFileSync('commands/usersettings/userconfig.json'));

// If there is a change in the config.json file, reload it
fs.watch('config.json', {persistent: false}).on('change', eventType => {
	if (eventType === 'rename') throw "do not remove, move, or rename the config.json file.";
	config = JSON.parse(fs.readFileSync('config.json'));
	console.log(`Config Files Reloaded`);
	// Re-Set the variables
	//bot = config.bot;
	//activities = config.bot.activities;
	//prefix = config.bot.prefix;
	//token = config.bot.token;
	//admin = config.admin;
	//logs = config.logs;
	//embed = config.misc.embed; 
	//customText = config.misc.customText;
	let {bot, admin, logs, misc} = config, {activities, prefix, token} = bot, {embed, customText} = misc;

});
let {bot, admin, logs, misc} = config, {activities, prefix, token} = bot, {embed, customText} = misc;

// Set the variables
//bot = config.bot;
//activities = config.bot.activities;
//prefix = config.bot.prefix;
//token = config.bot.token;
//admin = config.admin;
//logs = config.logs;
//embed = config.misc.embed;
//customText = config.misc.customText;

// Reload user-config
fs.watch('commands/usersettings/userconfig.json', {persistent: false}).on('change', eventType => {
	if (eventType === 'rename') throw "do not remove, move, or rename the userconfig.json file.";
	userconfig = JSON.parse(fs.readFileSync('commands/usersettings/userconfig.json'));
});


/* Command files management */

// Command Cooldown
const cooldowns = new Discord.Collection();

// Command File Management
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

/* Console text formatting variables */
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

/* Misc 'on ready' variables */
// This counts the number of times the bot is started
config.bot.startups++;

var adminBotStatus;
adminBotStatus = (!admin.adminOnly) ? 'Normal Mode' : 'Admin Only';
var CPUTemp;
var OSMem;

// When the client (bot) is ready
client.on('ready', () => {
	// Say hello in the console when the bot logs in
	console.log(`${color.Bcyan}Logged in as ${color.bold}${color.red}${client.user.tag}! \n${color.clear}${color.Bcyan}Admin only: ${color.Bblue}${admin.adminOnly}\n${color.cyan}StartUps: ${color.yellow}${bot.startups}${color.clear}`);
	// Login embeded if set to true in the config.json
	if (logs.botLoginMessage) {
		const botLoginEmbed = new MessageEmbed()
		.setColor('#84FFFB')
		.setTitle(`SpiderBot Logged In`)
		.setAuthor(client.user.tag)
		.setDescription(`Prefix: ${prefix}\nLog Channel: ${logs.logChannel}\nUse Perms: ${admin.adminOnly}`)
		.setTimestamp()
		.setFooter('Logged In');
		return client.channels.cache.get(logs.logChannel).send(botLoginEmbed);
	}

	// Waiting for the timeout to end for the new status
	client.user.setActivity(`Starting Bot And awaiting Details`);
	setInterval(() => {
		si.cpuTemperature().then(data => CPUTemp = data.max);
		si.mem().then(data => OSMem = data.used);
	}, 1000)

	// If the CPU temp gets above 75C, shut off the bot. Dont want to set your pc on fire now do you
	setInterval(() => {
		if (CPUTemp > 75) {
			async function overHeatShutDown() {
				await client.user.setStatus('invisible')
				await client.channels.cache.get(logs.logChannel).send(`The host got too hot\nCPU: ${CPUTemp}\u00B0C MEM: ${OSMem}`);
				console.log(`The host overheated: CPU: ${CPUTemp}\u00B0C MEM: ${OSMem} bytes`);
				await client.destroy();
				return process.exit();
			}
			overHeatShutDown();
		}
	}, 5000);
	
	function loginSetActivity() {
		client.user.setActivity(`Gaining Life | ${prefix}help\n${adminBotStatus} | StartUps: ${bot.startups}`);
		setInterval(() => {
			adminBotStatus = (!admin.adminOnly) ? 'Normal Mode' : 'Admin Only';
			var d = new Date();
			var a = d.getHours();
			var b = d.getMinutes();
			b = b.toString().padStart(2, '0');
			var time = `${a}:${b}`
			// Get a random activity text to display (the list of texts is in the config.json)
			const index = Math.floor(Math.random() * (activities.length - 1) +1);
			function formatBytes (a, b) {
				if (a === 0) return '0 Bytes';
				var c = 1024, d = b||2, e = ["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"], f = Math.floor(Math.log(a) / Math.log(c));
				OSMem = parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
				// Display the activity
				client.user.setActivity(`${activities[index]} | ${prefix}help | ${time}\n${adminBotStatus} | StartUps: ${bot.startups}\nCPU: ${CPUTemp}\u00B0C | MEM: ${OSMem}`);
			}
			formatBytes(OSMem);
		}, 10000);
	}
	setTimeout(loginSetActivity, 5000);
});

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

	/* Check if the command requires arguments. If required, and no were provided, tell the user the usage */
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
				return message.reply({ embed: { color: userconfig[message.author.username].embed.customColor || embed.defaultColor, title: `You cant use admin commands in the DMs (it crashes the bot, which is better than people being able to use them in DMs)` }});
			}
			if (message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) !== true) {
				return message.channel.send({ embed: { color: userconfig[message.author.username].embed.customColor || embed.defaultColor, title: 'That command is admin only' }});
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
fs.writeFileSync('config.json', JSON.stringify(config, null, 2), function(err) {
    if (err) throw err;
    console.log(`error`);
});

client.login(token);

 