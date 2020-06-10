const Discord = require('discord.js');
const config = require('./config.json')
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const fs = require("fs");

const client = new CommandoClient({
	commandPrefix: config['Bot']['Prefix'],
    owner: config['Bot']['Owner'],
    disableEveryone: true
});

// Logging
eval(fs.readFileSync('util/log.js')+'');

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['admin', 'Admin commands'],
		['utility', 'Utility commands'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
        eval: false,
        prefix: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));
    

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity(config['Bot']['Prefix'] + 'help');
});
    
client.on('error', console.error);
client.login(config['Bot']['Token']);
