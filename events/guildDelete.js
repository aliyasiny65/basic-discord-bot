const db = require('wio.db');
const { loggerWebhookID, loggerWebhookToken } = require('../config.json');
const { WebhookClient, MessageEmbed } = require('discord.js');
const webhookClient = new WebhookClient(loggerWebhookID, loggerWebhookToken);


module.exports = {
	name: 'guildDelete',
	once: false,
	async run(guild) {
		if (guild) {
			const client = guild.client;
			await client.user.setActivity(`chelp | ${client.guilds.cache.size} Servers`, { type: 'PLAYING' });

			// Delete prefix
			if (await db.fetch('prefix_' + guild.id)) {
				await db.delete('prefix_' + guild.id);
			}

			// Delete log channel
			if (await db.fetch('logch_' + guild.id)) {
				await db.delete('logch_' + guild.id);
			}

			// Delete welcome channel
			if (await db.fetch('welcomech_' + guild.id)) {
				await db.delete('welcomech_' + guild.id);
			}

			// Delete auto role channel
			if (await db.fetch('autorole_' + guild.id)) {
				await db.delete('autorole_' + guild.id);
			}

			// Delete mute role channel
			if (await db.fetch('muterole_' + guild.id)) {
				await db.delete('muterole_' + guild.id);
			}

			try {
				guild.owner.createDM()
					.then((channel) => {
						channel.send(translate('events.guildDelete.messages.ownerDM'));
					}).catch((err) => {});
			} catch (err) {}

			// Delete language
			if (await db.fetch('lang_' + guild.id)) {
				await db.delete('lang_' + guild.id);
			}
			
			const embed = {
				color: 0xff3b3b,
				title: 'Sunucudan Çıkarıldı',
				description: `**Sunucu Adı:** ${guild.name}\n**Sunucu ID:** ${guild.id}\n**Sunucu Sahibi:** ${guild.owner.user ? guild.owner.user.tag : "Bilinmiyor"}\n**Sunucu Sahibi ID:** ${guild.ownerID}\n**Sunucu Üye Sayısı:** ${guild.memberCount}`,
				timestamp: new Date(),
			};
			webhookClient.send("", {
				username: 'Crypon | Logger',
				avatarURL: "https://imgupload.io/images/2021/04/20/logger.png",
				embeds: [embed],
			});
		}
	},
};
