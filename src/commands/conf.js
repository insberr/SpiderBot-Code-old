const { Commands } = require('../main.js');

module.exports = class Conf extends Commands {
    constructor(client, message, args, data, bot) {
       super(client, message, args, data, bot, {
           name: 'conf',
           usage: 'Configure guild settings',
           guildOnly: true,
           perms: ['ADMINISTRATOR'],
           arguments: '<show | set[<option> <value>] | reset[<option> <value>]>'
       })
    };
    run(msg) {
        if (!this.checkPerms(msg)) return;
        this.sendT(msg, { title: 'This command is under development', color: this.userData[0].embed.color })
    }
};