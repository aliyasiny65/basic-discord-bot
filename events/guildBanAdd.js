const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
	name: 'guildBanAdd',
	once: false,
	async run(guild, user, client) {
		if (await db.fetch('logch_' + guild.id)) {
			const logChannel = await db.fetch('logch_' + guild.id);
			const logch = guild.channels.cache.find((ch) => ch.id === logChannel);

			let logEmbed = {
				color: 0x30b5f2,
				author: {
					name: `${user.username}#${user.discriminator}`,
					icon_url: user.displayAvatarURL({ format: 'png', dynamic: true }),
				},
				title: translate(logch, 'events.guildBanAdd.messages.embedTitle'),
				description: translate(logch, 'events.guildBanAdd.messages.embedDescription', user.id),
			};

			return logch.send({ embed: logEmbed });
		}
	},
};
