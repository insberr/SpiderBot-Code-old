// Import Discord.js
const Discord = require('discord.js');
const client = new Discord.Client({ particls: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const { Client, MessageEmbed, Permissions } = require('discord.js');

// Files Management And System Info
const fs = require('fs');
const si = require('systeminformation');
// Command Cooldown
const cooldowns = new Discord.Collection();

// Configuration
// If there is a change in the config.json file, reload it
let config = JSON.parse(fs.readFileSync('config.json')) 
fs.watch('config.json', {persistent: false}).on('change', eventType => {
	if (eventType === 'rename') throw "do not remove, move, or rename the config.json file."
	config = JSON.parse(fs.readFileSync('config.json'))
	//console.log(`Config File Reloaded`)
})
//console.log(config);

let userconfig = JSON.parse(fs.readFileSync('commands/usersettings/userconfig.json')) 
fs.watch('commands/usersettings/userconfig.json', {persistent: false}).on('change', eventType => {
	if (eventType === 'rename') throw "do not remove, move, or rename the userconfig.json file."
	userconfig = JSON.parse(fs.readFileSync('commands/usersettings/userconfig.json'))
	//console.log(`Config File Reloaded`)
})
//console.log(userconfig);

// Set config varuables
const bot = config.bot;
const activities = bot.activities;
const prefix = config.prefix;
const token = config.token;
const admin = config.admin;
const logs = config.logs;
const embed = config.embed;
const customText = config.customText;
// Broken - const color = config.consoleFormatting;

// Import Configuration Files (not auto reloaded)
//const { prefix, token, logs, admin, embed } = require('./config.json');
//const botConfig = require('./config.json');

// Preconfigured Embeded Messages
const savedEmbeds = require('./SpiderBot-Embeds.json');

// Command File Management
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}



// Formatted text in terminal
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


// This counts the number of times the bot is started
config.bot.startups = config.bot.startups + 1;
let data = JSON.stringify(config, null, 2);
fs.writeFileSync('config.json', data, function(err) {
    if (err) throw err;
    console.log(`error`);
});

// When the bot logs in
client.on('ready', () => {
	// Set Bot Status
	if (!admin.adminOnly) {
		var adminBotStatus = 'The bot is in normal mode';
	} else {
		var adminBotStatus = `The Bot Is Admin Only: ${admin.adminOnlyReason}`;
	}
	// Say hello in the console when the bot logs in
	console.log(`${color.Bcyan}Logged in as ${color.bold}${color.red}${client.user.tag}! \n${color.clear}${color.Bcyan}Admin only: ${color.Bblue}${config.admin.adminOnly}\n${color.cyan}StartUps: ${color.yellow}${bot.startups}${color.clear}`);

	// Waiting for the details to be gathered for the new display of the status
	client.user.setActivity(`Starting Bot | awaiting Details`);

	// This repeats every 5 seconds i think
	setInterval(() => {
		// Get a random activity text to display (the list of texts is in the config.json)
		const index = Math.floor(Math.random() * (activities.length - 1) +1);

		// Get CPU TEMP and Memory usage and set the status
		//si.mem().then(data => console.log(data));
		si.mem().then(data => { 
			var OSmemory = data;
			si.cpuTemperature().then(data => { 
				var CPUTemp = data;

				// This function converts the long string of Memory bytes used to Gigabytes
				function formatBytes (a,b) {
					if (0==a) return "0 Bytes";
					var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));
					var MemUsed = parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]
					// Display the activity
					return client.user.setActivity(`${activities[index]} | ${prefix}help | Useable!\n${adminBotStatus} | StartUps: ${bot.startups}\nCPU Temp: ${CPUTemp.max}\u00B0C\nMemory Usage:: ${MemUsed}`);
				}
				formatBytes(OSmemory.used);
			});	 
		})
		// If the CPU temp gets above 80C, shut off the bot. Dont want to set your pc on fire now do you
		si.cpuTemperature().then(data => {
			if (data.max > 80) {
				client.channels.cache.get(logs.logChannel).send(`Bot got too hot`);
				return client.destroy();
			}
		})
	}, 5000);
	
	// Login embeded if set to true in the config.json
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

// When the bot is added to a server
client.on('guildCreate', guild => {
	console.log(`Bot was added to a new server: ${guild.name}, ID: ${guild.id}, Members: ${guild.memberCount}.`);
});

// When the bot leaves a server
client.on('guildDelete', guild => {
	console.log(`Bot was removed from ${guild.name}, ID: ${guild.id}`);
})

client.on('message', async message => {
	// If the message does not have the prefix, ignore. Test if the user is a bot and ignore
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Split the arguments of the command
	const args = message.content.slice(prefix.length).split(/ +/);
	const argsTwo = message.content.slice(prefix.length).split('|');
	const commandName = args.shift().toLowerCase();

	// See if the command has an alias
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// If sure that the command is server only, tell the user
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute server only commands in the DMs!');
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
	

	// Test if the bot is admin only, test if command is admin only
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
			return message.reply(`The bot is admin only at the moment: ${admin.adminOnlyReason}`)
		}
		if (message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) !== true) {
			return message.reply(`The bot is admin only at the moment: ${admin.adminOnlyReason}`);
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

client.login(token);

 