// const Discord = require('discord.js'); //This can also be discord.js-commando or other node based packages!
const { Client, MessageEmbed, Permissions } = require('discord.js');
const eco = require("discord-economy");
// const client = new Discord.Client();

module.exports = {
    name: 'economy',
    aliases: ['econ', 'eco'],
    description: 'game',
    usage: 'um',
    async execute(message, args) {
        /*
        If you want to make discord-economy guild based you have to use message.author.id + message.guild.id as ID for example:
        eco.Daily(message.author.id + message.guild.id)
        
        This will create a unique ID for each guild member
        */

        //This reads the first part of your message behind your prefix to see which command you want to use.
        var command = args[0]

        if (command === 'balance') {

            var output = await eco.FetchBalance(message.author.id)
            message.channel.send(`Hey ${message.author.tag}! You own ${output.balance} coins.`);
        }

        if (command === 'daily') {

            var output = await eco.Daily(message.author.id)
            //output.updated will tell you if the user already claimed his/her daily yes or no.

            if (output.updated) {

                var profile = await eco.AddToBalance(message.author.id, 100)
                message.reply(`You claimed your daily coins successfully! You now own ${profile.newbalance} coins.`);

            } else {
                message.channel.send(`Sorry, you already claimed your daily coins!\nBut no worries, over ${output.timetowait} you can daily again!`)
            }

        }

        if (command === 'resetdaily') {

            var output = await eco.ResetDaily(message.author.id)

            message.reply(output) //It will send 'Daily Reset.'

        }

        if (command === 'leaderboard') {

            //If you use discord-economy guild based you can use the filter() function to only allow the database within your guild
            //(message.author.id + message.guild.id) can be your way to store guild based id's
            //filter: x => x.userid.endsWith(message.guild.id)

            //If you put a mention behind the command it searches for the mentioned user in database and tells the position.
            if (message.mentions.users.first()) {

                var output = await eco.Leaderboard({
                    filter: x => x.balance > 50,
                    search: message.mentions.users.first().id
                })
                message.channel.send(`The user ${message.mentions.users.first().tag} is number ${output} on my leaderboard!`);

            } else {

                eco.Leaderboard({
                    limit: 3, //Only takes top 3 ( Totally Optional )
                    filter: x => x.balance > 50 //Only allows people with more than 100 balance ( Totally Optional )
                }).then(async users => { //make sure it is async

                    if (users[0]) var firstplace = await message.client.users.fetch(users[0].userid) //Searches for the user object in discord for first place
                    if (users[1]) var secondplace = await message.client.users.fetch(users[1].userid) //Searches for the user object in discord for second place
                    if (users[2]) var thirdplace = await message.client.users.fetch(users[2].userid) //Searches for the user object in discord for third place

                    message.channel.send(`My leaderboard:

                        1 - ${firstplace && firstplace.tag || 'Nobody Yet'} : ${users[0] && users[0].balance || 'None'}
                        2 - ${secondplace && secondplace.tag || 'Nobody Yet'} : ${users[1] && users[1].balance || 'None'}
                        3 - ${thirdplace && thirdplace.tag || 'Nobody Yet'} : ${users[2] && users[2].balance || 'None'}`)

                })

            }
        }

        if (command === 'transfer') {

            var user = message.mentions.users.first()
            var amount = args[1]

            if (!user) return message.reply('Reply the user you want to send money to!')
            if (!amount) return message.reply('Specify the amount you want to pay!')

            var output = await eco.FetchBalance(message.author.id)
            if (output.balance < amount) return message.reply('You have fewer coins than the amount you want to transfer!')

            var transfer = await eco.Transfer(message.author.id, user.id, amount)
            message.reply(`Transfering coins successfully done!\nBalance from ${message.author.tag}: ${transfer.FromUser}\nBalance from ${user.tag}: ${transfer.ToUser}`);
        }

        if (command === 'coinflip') {

            var flip = args[1] //Heads or Tails
            var amount = args[2] //Coins to gamble

            if (!flip || !['heads', 'tails'].includes(flip)) return message.reply('Please specify the flip, either heads or tails!')
            if (!amount) return message.reply('Specify the amount you want to gamble!')

            var output = await eco.FetchBalance(message.author.id)
            if (output.balance < amount) return message.reply('You have fewer coins than the amount you want to gamble!')

            var gamble = await eco.Coinflip(message.author.id, flip, amount).catch(console.error)
            message.reply(`You ${gamble.output}! New balance: ${gamble.newbalance}`)

        }

        if (command === 'dice') {

            var roll = args[1] //Should be a number between 1 and 6
            var amount = args[2] //Coins to gamble

            if (!roll || ![1, 2, 3, 4, 5, 6].includes(parseInt(roll))) return message.reply('Specify the roll, it should be a number between 1-6')
            if (!amount) return message.reply('Specify the amount you want to gamble!')

            var output = eco.FetchBalance(message.author.id)
            if (output.balance < amount) return message.reply('You have fewer coins than the amount you want to gamble!')

            var gamble = await eco.Dice(message.author.id, roll, amount).catch(console.error)
            message.reply(`The dice rolled ${gamble.dice}. So you ${gamble.output}! New balance: ${gamble.newbalance}`)

        }

        if (command == 'delete') { //You want to make this command admin only!

            var user = message.mentions.users.first()
            if (!user) return message.reply('Please specify a user I have to delete in my database!')

            if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR !== true)) {
                return message.reply('You need to be admin to execute this command!');
            }
            var output = await eco.Delete(user.id)
            if (output.deleted == true) return message.reply('Successfully deleted the user out of the database!')

            message.reply('Error: Could not find the user in database.')

        }

        if (command === 'work') { //I made 2 examples for this command! Both versions will work!

            var output = await eco.Work(message.author.id)
            //50% chance to fail and earn nothing. You earn between 1-100 coins. And you get one out of 20 random jobs.
            if (output.earned == 0) return message.reply('Awh, you did not do your job well so you earned nothing!')
            message.channel.send(`${message.author.username}, You worked as a \` ${output.job} \` and earned :money_with_wings: ${output.earned}. You now own :money_with_wings: ${output.balance}`)


            var output = await eco.Work(message.author.id, {
                failurerate: 10,
                money: Math.floor(Math.random() * 500),
                jobs: ['cashier', 'shopkeeper']
            })
            //10% chance to fail and earn nothing. You earn between 1-500 coins. And you get one of those 3 random jobs.
            if (output.earned == 0) return message.reply('Awh, you did not do your job well so you earned nothing!')

            message.channel.send(`${message.author.username}, You worked as a \` ${output.job} \` and earned :money_with_wings: ${output.earned}. You now own :money_with_wings: ${output.balance}`)

        }

        if (command === 'slots') {

            var amount = args[1] //Coins to gamble

            if (!amount) return message.reply('Specify the amount you want to gamble!')

            var output = await eco.FetchBalance(message.author.id)
            if (output.balance < amount) return message.reply('You have fewer coins than the amount you want to gamble!')

            var gamble = await eco.Slots(message.author.id, amount, {
                width: 3,
                height: 1
            }).catch(console.error)
            message.channel.send(gamble.grid)//Grid checks for a 100% match vertical or horizontal.
            message.reply(`You ${gamble.output}! New balance: ${gamble.newbalance}`)

        }
    },
}