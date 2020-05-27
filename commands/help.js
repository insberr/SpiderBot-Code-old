const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var userconfig = JSON.parse(fs.readFileSync('commands/usersettings/userconfig.json'));
var prefix = config.bot.prefix, embed = config.misc.embed;

module.exports = {
	name: 'help',
	description: 'List all the bots commands or give info about a specific command.',
	aliases: ['commands', 'h'],
	usage: '(command name)',
	async execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Here\'s a list of all my commands:\n');
			data.push(commands.map(command => command.name).join(',\n'));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
			const helpDMEmbed = new MessageEmbed()
				.setColor(embed.defaultColor)
				.setAuthor(message.author.username)
				.setTitle(`Help`)
				.setDescription(data)
				.setFooter(`SpiderBot | Help`)
				.setTimestamp()
			return message.author.send(helpDMEmbed)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('you\'ve been sent you a DM with all the commands.');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('It seems like I can\'t DM you');
				});
		} else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) {
				return message.reply('That\'s not a valid command');
			}

			const helpCommandEmbed = new MessageEmbed()
				.setColor(userconfig[message.author.username].embed.customColor || embed.defaultColor)
				.setAuthor(message.author.username)
				.setTitle(`Help ${command.name}`)
				if (command.aliases) {
					helpCommandEmbed.addField('Aliases', command.aliases.join(', '))
				}
				if (command.description) {
					helpCommandEmbed.addField('Description', command.description )
				}
				if (command.usage) {
					helpCommandEmbed.addField('Usage', `${prefix}${command.name} ${command.usage}`)
				}
				if (command.admin) {
					helpCommandEmbed.addField('Admin Only', `This command is admin only`)
				}
				helpCommandEmbed.addField('Cooldown', `${command.cooldown || 0} seconds` )
				.setFooter(`SpiderBot | Help ${command.name}`)
				.setTimestamp()
			message.channel.send(helpCommandEmbed);
		}
	},
};