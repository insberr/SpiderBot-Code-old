const { Commands } = require('../main.js');

module.exports = class Send extends Commands {
    constructor(client, message, args, data, bot) {
       super(client, message, args, data, bot, {
           name: 'send',
           usage: 'Sends a message to the console',
           cooldown: 100,
           guildOnly: false,
           perms: ['BOT_OWNER'],
           arguments: '<text>'
       })
    };
    run(msg) {
        console.log(`[${msg.author.username + msg.author.discriminator}] ${this.args}`);
        this.sendT(msg, { title: `Sent message to the host`, desc: this.args, color: this.userData[0].embed.color })
    }
};