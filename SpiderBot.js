// Import Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();
const { Client, MessageEmbed } = require('discord.js');

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

// When the bot logs in
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	// Set Bot Status
	client.user.setActivity(`Being Developed | And One HArdWorking, Angry SpiderGaming | ${prefix}help`);
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
	// Message Contains
	if (message.content.includes("School") || message.content.includes("school")) {
		client.commands.get('school').execute(message);
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
		message.channel.send(`There was an error trying to execute that command!\nDetails\nUsed Command: ${command}\nPassed Arguments ${args.join(" ")} ${message.channel}`);
	}
});

client.login(token);

 