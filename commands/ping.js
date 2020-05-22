module.exports = {
    name: 'ping', // Command
    aliases: ['test'], // other ways of using the command
    cooldown: 10, // Adds a cooldown to the command
    description: 'Ping!', // Command description
    guildOnly: true, // Only useable in servers. (cant be used in DMs)
    args: false, // This command needs arguments
    usage: 'null', // How to use the command
    async execute(message, args) {
        message.channel.send('Pong.');
    },
};