const db = require('wio.db');
const translate = require('../language/translate');
const { ownerID } = require('../config.json');

const { reporterWebhookID, reporterWebhookToken } = require('../config.json');
const { WebhookClient, MessageEmbed } = require('discord.js');
const webhookClient = new WebhookClient(reporterWebhookID, reporterWebhookToken);

module.exports = {
	name: 'report',
	description: null,
	aliases: ['raporla', 'bildir'],
	args: true,
	usage: null,
	guildOnly: false,
	permissions: null,
	async run(message, args, client) {
		this.description = translate(message.channel, 'commands.report.description');
		this.usage = translate(message.channel, 'commands.report.usage');

		if (args.length < 3) {
			return message.channel.send(translate(message.channel, 'commands.report.messages.minArgLength'))
				.then((msg) => {
					msg.delete({ timeout: 7000 });
				});
		}

		const report = args.join(' ');
		message.channel.send(translate(message.channel, 'commands.report.messages.successful', message.author.id))
			.then((msg) => {
				message.delete();
				msg.delete({ timeout: 10000 });
			}).catch((err) => {});

		const embed = {
			color: 0x30b5f2,
			title: 'Rapor',
			description: `**Raporlayan:** ${message.author.tag}\n**Raporlayan ID:** ${message.author.id}\n${message.guild ? `**Raporlanan Sunucu:** ${message.guild.name}` : `**Raporlanan Kanal:** DM` }\n${message.guild ? `**Raporlanan Sunucu ID:** ${message.guild.id}` : `**Raporlanan Kanal ID:** ${message.channel.id}`}\n\n**Rapor:** ${report}`
		};

		webhookClient.send("", {
			username: 'Crypon | Reporter',
			avatarURL: "https://imgupload.io/images/2021/04/20/logger.png",
			embeds: [embed],
		})
	},
};
