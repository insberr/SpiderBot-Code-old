const { Command } = require('discord.js-commando');
const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log' }),
    ],
    format: winston.format.printf(log => `[${log.level.toUpperCase()}] ${log.message}`),
});

module.exports = class MeowCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'send',
            aliases: ['terminal'],
            group: 'developement',
            memberName: 'send',
            description: 'Sends the text to the hosts console.',
            args: [
                {
                    key: 'toSend',
                    prompt: 'What text would you like to send to the host?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { toSend }) {
        logger.log('info', `[${message.author.username}] ${toSend}`);
        const sendEmbed = {
            color: '#ff0000',
            author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL({
                    dynamic: true,
                    size: 512,
                    format: "png"
                }),
            },
            title: `Your message was sucessfully sent to the host; "${toSend}"`,
        }
        return message.embed(sendEmbed);
    }
};