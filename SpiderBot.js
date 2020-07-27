const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const sqlite = require('sqlite');
const path = require('path');
require('dotenv').config();
const f = require('./f.js');
const { BOT_TOKEN } = process.env;


const client = new CommandoClient({
	commandPrefix: '&',
	owner: '523826395801976842',
	invite: 'https://discord.gg/6kFYJAP',
})

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['config', 'Edit the bots config'],
		['mod', 'Moderation commands'],
		['info', 'User info/configuration, leveling, and more'],
		['fun', 'Fun commands'],
		['economy', 'Economy game (in dev)'],
		['dev', 'Development commands'],
		['test', 'Commands being developed'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	/*
	.registerDefaultCommands({
		help: false,
	})
	*/
	.registerCommandsIn(path.join(__dirname, 'commands'));

sqlite.open(path.join(__dirname, "database/settings.sqlite3")).then((db) => {
	client.setProvider(new SQLiteProvider(db));
});


client.once('ready', () => {
	f.startUp(client)
});

client.on('error', m => logger.log('error', m));
client.login(BOT_TOKEN)