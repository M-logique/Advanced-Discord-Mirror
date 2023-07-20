const {SlashCommandBuilder} = require("discord.js")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('will delete a registred mirror')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name to get info')
                .setRequired(true)),

	async execute(interaction) {
        const name = interaction.options.getString('name');
        await interaction.client.db.delete(name)
        await interaction.client.db.pull("names", name)
        await interaction.reply({content: `deleted ${name}`, ephemeral: true})
	},
};
