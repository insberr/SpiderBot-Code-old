const { Client, MessageEmbed } = require('discord.js');
const { prefix, token, logChannel, botLoginMessage, adminOnly } = require('../config.json');
const savedEmbeds = require('../SpiderBot-Embeds.json');
const fs = require('fs');

module.exports = {
    name: 'calculate',
    description: 'Do calculations!!',
    execute(message, args) {
        if (!args.length) {
            return message.channel.send("You did not provide any arguments");
        } else {
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
            default: {
                return message.channel.send(`Use "${prefix}help cal" for the proper syntax.`);
            }
            }
            return message.channel.send(`${operand1} ${signs[operation.toLowerCase()]} ${operand2} = ${result}`);
        }
    },
};