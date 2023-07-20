const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('add a new mirror'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('add')
			.setTitle('Add A New Mirror 🦛')
			
		const name = new TextInputBuilder()
			.setCustomId('name')
			.setLabel("Enter a unique name 🦏")
			.setRequired(true)
			.setStyle(TextInputStyle.Short);

		const token = new TextInputBuilder()
			.setCustomId('token')
			.setLabel("Enter ur token 😱")
			.setRequired(true)
			.setStyle(TextInputStyle.Paragraph);
		const id = new TextInputBuilder()
			.setCustomId('id')
			.setLabel("Enter ur mirror channel id 🐲")
			.setStyle(TextInputStyle.Short)
			.setRequired(true);
		const webhook = new TextInputBuilder()
			.setCustomId('webhook')
			.setLabel("Enter the webhook u want to get messages 🐊")
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);

			const l = new ActionRowBuilder().addComponents(name)
		const a = new ActionRowBuilder().addComponents(token)
		const b = new ActionRowBuilder().addComponents(id)
		const c = new ActionRowBuilder().addComponents(webhook)

		modal.addComponents(l,a,b,c);
		await interaction.showModal(modal);
	},
};
