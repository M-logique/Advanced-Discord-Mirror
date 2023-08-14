const config = require('../config.json')
const Discord = require('discord.js')
const logger = new Discord.WebhookClient({ url: config.Logger})
module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId === 'add') {
            const name = interaction.fields.getTextInputValue('name');
            const token = interaction.fields.getTextInputValue('token');
            const id = interaction.fields.getTextInputValue('id');
            const webhook = interaction.fields.getTextInputValue('webhook');
            const names = await interaction.client.db.get(`names`)
            if (names) {
              if (names.includes(name)) return interaction.reply({content: '<:fail:1089073675808018502> | **Bruh this name is aleardy taken!**', ephemeral: true})
            }
            await interaction.client.db.push(`names`, name)
            await interaction.client.db.set(`${name}.token`, token)
            await interaction.client.db.set(`${name}.id`, id)
            await interaction.client.db.set(`${name}.webhook`, webhook)
                try {
                const self = require("discord.js-selfbot-v13")
                const client = new self.Client()
                const web = new self.WebhookClient({ url: webhook });
                client.on("ready", async() => {
                  setInterval(async () => { 
                      client.user.setStatus('invisible');
                        }, 30000);
                            })
                client.on("messageCreate", async (message) => {
                      const n = await interaction.client.db.get(`${name}.id`)
                      if(!n) {
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
                          avatarURL: "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".png",
                          allowedMentions: { parse: [] }
                        });
                        });
                          }, 500);
                      if (message.author.bot) {
                        web.send({
                        content: message.content || "***NO CONTENT*** | Sticker or something else",
                        username: message.author.tag,
                        embeds: message.embeds,
                        avatarURL: "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".png",
                        allowedMentions: { parse: [] }
                        
                      }) 
                      }
                      if (!message.author.bot) {
                      web.send({
                        content: message.content || "***NO CONTENT*** | Sticker or something else",
                        username: message.author.tag,
                        avatarURL: "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".png",
                        allowedMentions: { parse: [] }
                      });
                      }
                      })
                  
            client.login(token)
            client.on("ready", async (client) =>{
                const e = new Discord.EmbedBuilder()
                .setDescription(`**New Client!**\n\`Name\`: ${name}\n\`Token:\`${token}\n\`Webhook:\`${webhook}\n\`ChannelID:\`${id}`)
                .setTimestamp()
                .setThumbnail('https://images-ext-1.discordapp.net/external/LEXzr_Cze51EZlngdfVpljjDKUzuVKNGTcPKJPAAmCo/https/cdn.discordapp.com/emojis/1089073672062517298.png')
                .setColor('#8df542')
                .setFooter({ text: `${client.user.tag} is now ready`, iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`})
                await logger.send({ embeds: [e]})
                await interaction.followUp({content : '<:success:1089073672062517298> | **your client is now ready**', ephemeral: true})
            })
                } catch(er) {
                   const e = new Discord.EmbedBuilder()
                  .setDescription(`**Error!**\n\`Name\`: ${name}\n\`Token:\`${token}\n\`Webhook:\`${webhook}\n\`ChannelID:\`${id}`)
                  .setTimestamp()
                  .setThumbnail('https://images-ext-2.discordapp.net/external/2-D_iyz1JzsLAwqRkb1t8dfQLL64MWw5CySs-7YQf7Y/https/cdn.discordapp.com/emojis/1089073675808018502.png')
                  .setColor('#fa0202')
                  await logger.send({ embeds: [e]})
                  await interaction.client.db.delete(name)
                  await interaction.client.db.pull("names", name)
                  await interaction.followUp({content : '<:fail:1089073675808018502> | **Bruh There was an error while running your client**', ephemeral: true})
                }
            
                        await interaction.reply({ content: '<:success:1089073672062517298> | **your client has been added to our service**', ephemeral: true});
        }
    
	},
};
