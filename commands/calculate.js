const { Client, MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
    name: 'calculate',
    description: 'Do basic calculations with the bot.',
    aliases: ['cal', 'calc'],
    args: true,
    usage: '[add | sub | mul | div] [number 1] [number 2]',
    async execute(message, args) {
        let signs = {
        "add": "+",
        "sub": "-",
        "mul": "x",
        "div": "÷"
        }
        let [operation, operand1, operand2] = args
        operand1 = parseInt(operand1), operand2 = parseInt(operand2)
        let result
        switch (operation.toLowerCase()) {
            case "add": {
                result = operand1 + operand2
                break
            }
            case "sub": {
                result = operand1 - operand2
                break
            }
            case "mul": {
                result = operand1 * operand2
                break
            }
            case "div": {
                result = operand1 / operand2
                break
            }
        }
        const calculateEmbed = new MessageEmbed()
            .setColor(`ff0000`)
            .setAuthor(message.author.username + ' | Calculation', message.author.displayAvatarURL({
                dynamic: true,
                size: 512,
                format: "png"
            }))
            .setTitle(`${operand1} ${signs[operation.toLowerCase()]} ${operand2} = ${result}`)
            .setDescription(` `)
            .setFooter(`SpiderBot | ${prefix}help cal`)
            .setTimestamp()
        return message.channel.send(calculateEmbed);
    },
};