process.on('unhandledRejection', (reason, promise) => {
	let e = reason        
	});
	process.on('rejectionHandled', (promise) => {
	  let e = promise
	})
	process.on("uncaughtException", (err, origin) => {
	let e = err});
	process.on('uncaughtExceptionMonitor', (err, origin) => {
	let e = err});
	
const fs = require('node:fs');
const config = require("./config.json")
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuidler } = require('discord.js');
const { token } = require('./config.json');
const { QuickDB } = require("quick.db");
const db = new QuickDB(); // will make a json.sqlite in the root folder
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.db = db
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!config.ids.includes(interaction.user.id)) return interaction.reply({content: '<:fail:1089073675808018502> | **access denied!**', ephemeral: true})
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token)