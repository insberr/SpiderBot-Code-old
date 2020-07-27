const { Command } = require('discord.js-commando');

module.exports = class MeowCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            group: 'mod',
            memberName: 'purge',
            description: 'Mass deletes messages (default 100)',
            userPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
            args: [
                {
                    key: 'amount',
                    prompt: 'How many messages to purge?',
                    type: 'integer',
                    default: 99,
                },
            ],
        });
    }

    run(message, { amount }) {
        amount = parseInt(amount) + 1;
        if (isNaN(amount)) {
            return message.reply('That isnt a valid number');
        } else if (amount <= 1 || amount > 100) {
            return message.reply('Input a number between 1 and 999');
        }
        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('There was an error deleting messages in this channel');
        });
    }
};