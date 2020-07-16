const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const winston = require('winston');
require('dotenv').config();
var token = process.env.BOT_TOKEN;



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
client.login(token)


/*
const PREFIX = '&';
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

client.on('message', async message => {
	if (message.content.startsWith(PREFIX)) {
		const input = message.content.slice(PREFIX.length).split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');

		if (command === 'addtag') {
			const splitArgs = commandArgs.split(' ');
			const tagName = splitArgs.shift();
			const tagDescription = splitArgs.join(' ');

			try {
				// equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
				const tag = await Tags.create({
					name: tagName,
					description: tagDescription,
					username: message.author.username,
				});
				return message.reply(`Tag ${tag.name} added.`);
			} catch (e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					return message.reply('That tag already exists.');
				}
				return message.reply('Something went wrong with adding a tag.');
			}
		} else if (command === 'tag') {
			const tagName = commandArgs;

			// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
			const tag = await Tags.findOne({ where: { name: tagName } });
			if (tag) {
				// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
				tag.increment('usage_count');
				return message.channel.send(tag.get('description'));
			}
			return message.reply(`Could not find tag: ${tagName}`);
		} else if (command === 'edittag') {
			const splitArgs = commandArgs.split(' ');
			const tagName = splitArgs.shift();
			const tagDescription = splitArgs.join(' ');

			// equivalent to: UPDATE tags (descrption) values (?) WHERE name = ?;
			const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
			if (affectedRows > 0) {
				return message.reply(`Tag ${tagName} was edited.`);
			}
			return message.reply(`Could not find a tag with name ${tagName}.`);
		} else if (command === 'taginfo') {
			const tagName = commandArgs;

			// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
			const tag = await Tags.findOne({ where: { name: tagName } });
			if (tag) {
				return message.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
			}
			return message.reply(`Could not find tag: ${tagName}`);
		} else if (command === 'showtags') {
			// equivalent to: SELECT name FROM tags;
			const tagList = await Tags.findAll({ attributes: ['name'] });
			const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
			return message.channel.send(`List of tags: ${tagString}`);
		} else if (command === 'removetag') {
			// equivalent to: DELETE from tags WHERE name = ?;
			const tagName = commandArgs;
			const rowCount = await Tags.destroy({ where: { name: tagName } });
			if (!rowCount) return message.reply('That tag did not exist.');

			return message.reply('Tag deleted.');
		}
	}
});


*/

