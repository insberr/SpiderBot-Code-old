# SpiderBot-Code
The bot is still being developed, and has a long way till It's done. A lot of the components of this bot are made specifically for my [discord server](https://discord.gg/gRMbZyU) right now, however as time goes on I will work on making it more usable usable elsewhere.

[comment]: <> (Invite the bot to your server)

## Setup
<br>Check your version of nodejs by typing 
```bash
node -v
``` 
in the terminal
<br>Make sure you have nodejs `v12.0.0` or newer installed
<br>Install discordjs using 
```bash
npm install discord.js
```
<br>Go into the `config.json` file and replace `TOKEN` with your token. Save the file
<br>To run SpiderBot, use 
```shell
cd /THE_BOTS_DIRECTORY
```
then type
```shell
node SpiderBot.js
```
in the teminal. It will dispay a message saying 
```javascript
Logged in as THE_BOTS_USERNAME!
Admin Only: false
```

## Bot Usage
<br>The prefix is `&` by default and can be changed in the `config.json` file

### Quick Command Referance
<br>See all commands in the <a href="https://spidergamin.github.io/SpiderBot-Code" style="color: red">documentation</a>
<br>`botconfig` - Configure the bot using commands (not fully implemented yet)
<br>`calculate` - Calculate something.
<br>`embed` - Create or use a preconfigured embed.
<br>`info` - Get user or server info
<br>`kick` - Kick a user and give the reason
<br>`ping` - Sends 'Pong' in return (soon to have the milliseconds)
<br>`purge` - Bulk delete messages
<br>`send` - Sends the text after the command to the hosts console/terminal

## To Do
### v1.1.0
* [ ] Clean up code
* [ ] Add more comments
* [x] Add help command

## Commands To Add
* config: set bot status, set log channel, set channels for no command usage, swear filter channels to ignore, set bypass roles
* music commands
* Swear filter 
* ban

## Future Plans
Here are some of the future plans
* [ ] Add moderation commands
* [ ] Add configuration commands
* [ ] Add ranking system, out roles, reaction roles, and possibly a verification role system
* [ ] Add economy game
* [ ] Make a documentation (user manuel)
* [ ] Use mathjs for the calculation command
* [ ] Make locally hosted web UI for easy configuring

## Done 
### v1.1.2
* Added `info` command functionallity (not finished)
* Added functionallity to the kick command
* Added an admin only config command
* When the bot is set to `admin only` the bots status goes to `idle`
* Reworded text
* Changed the config file reading
* Added `+ - x /` to the calculate command
* Colored text logged to the console
* Added color variables for easy console text coloring
* Fixed the crash when any command that was admin only was used in the DMs
* Fixed the crash when any command was used in the DMs and the bot was in admin only mode
* The bot logs all text sent to the console by the `send` command to a file named `Send-Command.txt` in the `/Logs` directory
#### Known Issues
* Embed command still needs some work
* Still need to remove some of the unneeded commands
#### To Do
* [ ] Use math.js for the calculate command
* [ ] Remove random and unused code
* [ ] More command functionallity
* [ ] Maybe make more of the messages embed
### v1.1.0
* Commands have alieses
* Added a help command
* Colorized some of the `consol.log` logs
* Made some commands admin only
* Admin commands can not be used in the bots DMs (it causes a crash)
* Added the admin only feture
* Removed lots of unused code
* The kick command is now fully implemented
### v0.1.2
* Reduced the amount of code
* Combined `embed` and `savedembed` commands into one file.
* Added License

## Resurces Used
<br>The base code of the bot (largely modifyed by me) - https://discordjs.guide/
<br>I used this to learn JavaScript - [w3.schools.com](w3.schools.com)
<br>[Discord.js Documentation](https://discord.js.org/?source=post_page---------------------------#/docs/main/stable/general/welcome)
<br>Discord.js discord server - https://discord.gg/bRCvFy9

## Credits
<br>[SpiderGamin](https://github.com/SpiderGamin) - Bot Creator
<br>[AbacabaTheAbacus](https://github.com/AbacabaTheAbacus) - helped with some of the code 
- Told me to use the `switch` rather than `if`
- Helps test the bot
- The config file reload
