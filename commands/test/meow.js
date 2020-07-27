const { Command } = require('discord.js-commando');

module.exports = class MeowCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'meow',
            aliases: ['kitty-cat'],
            group: 'test',
            memberName: 'meow',
            description: 'Replies with meow, Kitty cat.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10,
            }
        });
    }

    run(message) {
        return message.say('Meow!');
    }
};