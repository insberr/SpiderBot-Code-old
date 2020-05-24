const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));
const prefix = config.prefix;

module.exports = {
    name: 'calculate',
    description: 'Do basic calculations with the bot.',
    aliases: ['cal', 'calc'],
    args: true,
    cooldown: 2,
    usage: '[add | + | sub | - | mul | x | div | /] [number 1] [number 2]',
    async execute(message, args) {
        let signs = {
        "add": "+",
        "sub": "-",
        "mul": "x",
        "div": "÷",
        "+": "+",
        "-": "-",
        "x": "x",
        "/": "÷"
        }
        let [operation, operand1, operand2] = args
        operand1 = parseFloat(operand1), operand2 = parseFloat(operand2)
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
            case '+': {
                result = operand1 + operand2
                break
            }
            case '-': {
                result = operand1 - operand2
                break
            }
            case 'x': {
                result = operand1 * operand2
                break
            }
            case '/': {
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