const {SlashCommandBuilder , EmbedBuilder} = require("discord.js")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('data')
		.setDescription('get mirror data')
    .addStringOption(option =>
            option.setName('name')
                .setDescription('name to get info')
                .setRequired(true)),
    
	async execute(interaction) {
        const name = interaction.options.getString('name');
        const token = await interaction.client.db.get(`${name}.token`)
        const id = await interaction.client.db.get(`${name}.id`)
        const webhook = await interaction.client.db.get(`${name}.webhook`)
        const embed = new EmbedBuilder()
            .setTitle(name || "no")
            .addFields(		
                { name: 'Token', value: token || "no" },
                { name: 'Id', value: id || "no" },
                { name: 'Webhook', value: webhook || "no" },
            )
            
        await interaction.reply({embeds:[embed]})

	},
};
