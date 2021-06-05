const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
	name: 'emojiCreate',
	once: false,
	async run(emoji, client) {
		if (emoji.guild) {
			if (await db.fetch('logch_' + emoji.guild.id)) {
				const logChannel = await db.fetch('logch_' + emoji.guild.id);
				const logch = emoji.guild.channels.cache.find((ch) => ch.id === logChannel);

				const animated = emoji.animated
					? translate(emoji, 'basic.yes')
					: translate(emoji, 'basic.no');

				let logEmbed = {
					color: 0x30b5f2,
					title: translate(emoji, 'events.emojiCreate.messages.embedTitle'),
					description: translate(
						emoji,
						'events.emojiCreate.messages.embedDescription',
						emoji.name,
						emoji.id,
						animated,
						emoji.url
					),
				};

				return logch.send({ embed: logEmbed });
			}
		}
	},
};
