const client = require('discord.js-commando')
const fs = require('fs');
const Sequelize = require('sequelize');

const botConfigDB = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'botconfig.sqlite',
});

const botConfig = botConfigDB.define('tags', {
	server: {
		type: Sequelize.STRING,
		unique: true,
	},
	prefix: {
        type: Sequelize.TEXT,
        defaultValue: '&',
        allowNull: false,
    },
	logChannel: Sequelize.STRING,
    noUseChannels: Sequelize.ARRAY,
    noLevelChannels: Sequelize.ARRAY,
    muteRole: Sequelize.STRING,
    rank: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

const userConfigDB = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'userconfig.sqlite',
});
const userConfig = userConfigDB.define('tags', {
    userID: {
        type: Sequelize.STRING,
        unique: true,
    },
    color: {
        type: Sequelize.STRING,
        defaultValue: '#ff0000',
        allowNull: false,
    },
    age: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    pronoun: {
        type: Sequelize.STRING,
        defaultValue: 'None',
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        defaultValue: 'None',
        allowNull: false,
    },
});


var methods = {};

methods.getData = async function (DB, tagName, data) {
    const tag = await [DB].findOne({ where: { name: tagName } });
    return data(tag);
}


methods.color = {
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

methods.botStartUp = async function () {
    botConfig.sync();
    let { bot, admin, logs, misc } = config, { activities, prefix, token } = bot, { embed, customText } = misc;
    var adminBotStatus = (!config.admin.adminOnly) ? 'Normal Mode' : 'Admin Only';
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

    client.user.setActivity(`Starting Bot And awaiting Details`);

    function loginSetActivity() {
        client.user.setActivity(`Gaining Life | ${prefix}help\n${adminBotStatus} | StartUps: ${bot.startups}`);
        setInterval(() => {
            var d = new Date();
            var a = d.getHours();
            var b = d.getMinutes();
            b = b.toString().padStart(2, '0');
            var time = `${a}:${b}`
            // Get a random activity text to display (the list of texts is in the config.json)
            const index = Math.floor(Math.random() * (activities.length - 1) + 1);
            client.user.setActivity(`${activities[index]} | ${prefix}help | ${time}\n${adminBotStatus} | StartUps: ${bot.startups}`);

        }, 10000);
    }
    setTimeout(loginSetActivity, 5000);
};

methods.setStatus = async function (newStatus) {
    // Set a new status for the bot
}

methods.swearFilter = async function (message, callback) {
    var swears = JSON.parse(fs.readFileSync('swearfilter.json'));
    swears.forEach(word => {
        if (message.content.toLowerCase().includes(word)) {
            if (message.channel.type === 'text') message.delete();
            return callback({ swearing: true, word: word, message: message.content });
        }
        return callback({ swearing: false });
    });
}

methods.commandUse = async function (client, message, config, userconfig, color, callback) {
    let { bot, admin, logs, misc } = config, { activities, prefix, token } = bot, { embed, customText } = misc;
    userconfig = userconfig[message.author.id] || userconfig.default;
    const cooldowns = new Discord.Collection();

    // Command File Management
    client.commands = new Discord.Collection();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }

    // If the message does not have the prefix, ignore. Test if the user is a bot and ignore
    if (!message.content.startsWith(prefix)) return;

    // if dms return
    // if (message.channel.type !== 'text') return message.channel.send('You can not use the bot in the DMs.');



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
        return message.channel,send({ embed: { title: `You can't use that command in the DMs! `, color: userconfig.embed.color } });
    }

    /* Check if the command requires arguments. If required, and no were provided, tell the user the usage */
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments,`;
        if (command.usage) {
            reply += `\nThe commands usage is: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send({ embed: { title: reply, color: userconfig.embed.color } });
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
            return message.channel.send({ embed: { title: `Please wait ${timeLeft.toFixed(1)}s before reusing the \`${command.name}\` command.`, color: userconfig.embed.color } });
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


    // Test if the bot is admin only, test if command is admin only
    if (!admin.adminOnly) {
        if (command.admin) {
            if (message.channel.type !== 'text') {
                return message.channel.send({ embed: { title: `You cant use admin commands in the DMs`, color: userconfig.embed.color  } });
            }
            if (message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) !== true) {
                return message.channel.send({ embed: { title: 'This command is admin only', color: userconfig.embed.color } });
            }
        }
    } else {
        if (message.channel.type !== 'text' || message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR) !== true) {
            return message.channel.send({ embed: { title: `The bot is admin only at the moment: ${admin.adminOnlyReason}`, color: userconfig.embed.color } })
        }
    }

    // Execute the command
    try {
        command.execute(message, args, argsTwo, color);
    } catch (error) {
        console.error(error);
        message.channel.send({ embed: { title: `There was an error using ${command}\nArgs: ${args.join(' ')}`,color: userconfig.embed.color } });
        return callback(`There was an error using ${command}\nArgs: ${args.join(' ')}`)
    }
    return callback({ command: command, args: args, user: message.author.username, time: `${new Date().getHours}:${new Date().getMinutes}` });
}

methods.embed = function (type, msg, other, callback) {
    let { bot, admin, logs, misc } = other.config, { activities, prefix, token } = bot, { embed, customText } = misc;
    let userConfig = other.userConfig;
    const makeEmbed = new MessageEmbed()
        .setColor(userConfig.embed.color)
        .setTitle(`Incorrect use of that command`)
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({
            dynamic: true,
            size: 512,
            format: "png"
        }))
        .addField(`use`)
        .setTimestamp()
        .setFooter(`hi`);
    return callback(makeEmbed);
}

var userconfig;
userconfig = JSON.parse(fs.readFileSync('old-commands/usersettings/userconfig.json'));

methods.saveUserConfig = async function (message, data) {
    console.log(data)
    userconfig[data.user.id] = {
        userName: data.user.username,
        userID: data.user.id,
        embed: {
            color: data.embed.color,
            info: data.embed.info
        },
        personal: {
            age: data.personal.age,
            pronouns: data.personal.pronouns,
            bday: data.personal.bday
        }

    }
    fs.writeFileSync('commands/usersettings/userconfig.json', JSON.stringify(userconfig, null, 2), function (err) {
        if (err) throw err;
        console.log(`error`);
    });
};

methods.removeUserConfig = function(data) {
    userconfig[data.user.id] = {
        userName: userconfig.default,
        userID: userconfig.default,
        embed: {
            color: userconfig.default,
            info: userconfig.default
        },
        personal: {
            age: userconfig.default,
            pronouns: userconfig.default,
            bday: userconfig.default
        }
    }
    fs.writeFileSync('commands/usersettings/userconfig.json', JSON.stringify(userconfig, null, 2), function (err) {
        if (err) throw err;
        console.log(`error`);
    });
}

module.exports = methods;