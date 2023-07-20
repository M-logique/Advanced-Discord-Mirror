const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('names')
		.setDescription('get mirror names'),
	async execute(interaction) {
		const names = await interaction.client.db.get("names")
        const name = names.join("\n\n")
		const embed = new EmbedBuilder()
			.setTitle('names')
			.setDescription(`\`\`\`\n${name}\n\`\`\``)
			.setColor("Random")
        await interaction.reply({content: ' ', embeds: [embed], ephemeral: true})
	},
};
