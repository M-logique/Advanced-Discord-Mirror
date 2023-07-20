const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
        await interaction.channel.send(interaction.client.ws.ping + " ms");
	},
};
