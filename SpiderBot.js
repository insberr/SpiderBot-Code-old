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
	// IF USER SAYS SCHOOL, GET ANGRY jk delete message
	if (message.content.includes("School") || message.content.includes("school")) {
		// client.commands.get('school').execute(message);
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
	
	// Bot Commands
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	
	if (!client.commands.has(command)) return;
	try {
		client.commands.get(command).execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.channel.send(`There was an error trying to execute that command!`);
	}

});

client.login(token);

 
