const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
	name: 'messageDelete',
	once: false,
	async run(message, client) {
		if (message.guild) {
			if (message.author.bot) return;

			if (await db.fetch('logch_' + message.guild.id)) {
				const logChannel = await db.fetch('logch_' + message.guild.id);
				const prefix = await db.fetch('prefix_' + message.guild.id);

				const logch = message.guild.channels.cache.find((ch) => ch.id == logChannel);

				let logEmbed = {
					color: 0x30b5f2,
					author: {
						name: `${message.author.username}#${message.author.discriminator}`,
						icon_url: message.author.displayAvatarURL({ format: 'png', dynamic: true }),
					},
					title: translate(message, 'events.messageDelete.messages.embedTitle', message.channel.name),
					description: message.content,
				};

				if (logEmbed.description.length > 2000) {
					logEmbed.description = translate(message, 'basic.over2000');
					return logch.send({ embed: logEmbed });
				}

				return logch.send({ embed: logEmbed });
			}
		}
	},
};
