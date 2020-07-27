const client = require('discord.js-commando')
const fs = require('fs');
const winston = require('winston');
const chalk = require('chalk')

var methods = {};

methods.log = function (l, m) {
    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'log.txt' }),
        ],
        format: winston.format.printf(log => `${log.message}`),
    });
    logger.log(l,m);
};

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

methods.startUp = async function (c) {
    // let { bot, admin, logs, misc } = config, { activities, prefix, token } = bot, { embed, customText } = misc;
    // var adminBotStatus = (!config.admin.adminOnly) ? 'Normal Mode' : 'Admin Only';
    // Say hello in the console when the bot logs in
    this.log('info', `${chalk.bgGrey('chalk ')}Logged in as ${color.bold}${color.red}${c.user.tag}! \n${color.clear}${color.Bcyan}Admin only: ${color.Bblue}{admin.adminOnly}\n${color.cyan}StartUps: ${color.yellow}{bot.startups}${color.clear}`);
    // Login embeded if set to true in the config.json
    /* 
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
    */

    c.user.setActivity(`Starting Bot And awaiting Details`);

    function loginSetActivity() {
        c.user.setActivity(`Gaining Life | {prefix}help\n{adminBotStatus} | StartUps: {bot.startups}`);
        statusI = setInterval(() => {
            var d = new Date();
            var a = d.getHours();
            var b = d.getMinutes();
            b = b.toString().padStart(2, '0');
            var time = `${a}:${b}`
            // Get a random activity text to display (the list of texts is in the config.json)
            // const index = Math.floor(Math.random() * (activities.length - 1) + 1);
            c.user.setActivity(`{activities[index]} | {prefix}help | ${time}\n{adminBotStatus} | StartUps: {bot.startups}`);

        }, 10000);
    }
    setTimeout(loginSetActivity, 5000);
};

methods.setStatus = async function (status) {
    clearInterval(statusI);
    client.user.setActivity(status);
};

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

module.exports = methods;