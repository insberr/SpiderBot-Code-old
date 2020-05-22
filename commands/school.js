const { Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'school',
    description: 'When you say school, do this',
    async execute(message, args) {
        var badword = message.content;
		message.delete()
			.then(message => console.log(`${message.author.username} said school: '${message.content}'`))
			.catch(console.error);
		const replaceembed = new MessageEmbed()
			.setColor('#ff0000')
			.setAuthor(message.author.username, message.author.displayAvatarURL({
				dynamic: true,
				size: 512,
				format: "png"
			}))
			.setTitle(badword.replace(/School/g, "Sch\\*\\*l").replace(/school/g, "sch\\*\\*l"))
			.setTimestamp()
			.setFooter(`Spider Bot`);
            return message.channel.send(replaceembed);
    },
};