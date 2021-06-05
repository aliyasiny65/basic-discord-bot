const { botName, loggerWebhookID, loggerWebhookToken } = require('../config.json');
const db = require('wio.db');
const translate = require('../language/translate');
const { WebhookClient, MessageEmbed } = require('discord.js');
const webhookClient = new WebhookClient(loggerWebhookID, loggerWebhookToken);


module.exports = {
	name: 'guildCreate',
	once: false,
	async run(guild) {
		const client = guild.client;
		await client.user.setActivity(`chelp | ${client.guilds.cache.size} Servers`, { type: 'PLAYING' });
		
		await db.set('prefix_' + guild.id, '!c');
		const prefix = await db.fetch('prefix_' + guild.id);
		const channel = guild.channels.cache.filter((c) => c.type == 'text').find((ch) => ch.position == 0);

		channel.send(translate(channel, 'events.guildCreate.messages.message', prefix));

		const embed = {
			color: 0x3dff2b,
			title: 'Yeni Sunucuya Eklendi',
			description: `**Sunucu Adı:** ${guild.name}\n**Sunucu ID:** ${guild.id}\n**Sunucu Sahibi:** ${guild.owner.user ? guild.owner.user.tag : "Bilinmiyor"}\n**Sunucu Sahibi ID:** ${guild.ownerID}\n**Sunucu Üye Sayısı:** ${guild.memberCount}`,
			timestamp: new Date(),
		};
		webhookClient.send("", {
			username: 'Crypon | Logger',
			avatarURL: "https://imgupload.io/images/2021/04/20/logger.png",
			embeds: [embed],
		});
	},
};
