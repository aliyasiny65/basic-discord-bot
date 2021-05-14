const { botName } = require('../config.json');
const db = require('wio.db');
const translate = require('../language/translate.js');
const chalk = require('chalk');

module.exports = {
	name: 'ready',
	once: false,
	async run(client) {
		console.log('Crypon Ready');

		/*try {
			client.guilds.cache.get('818062752148357142').emojis.cache.get('835209838845231116').edit({ name: 'no_' })
				.then((r) => console.log(`Emoji edited! ${r}`))
				.catch(err => console.error('HATA 1', err));
		} catch (e) {
			console.log('HATA', e);
		}*/

		client.user.setUsername(botName);
		let activities = [`chelp`, `${client.guilds.cache.size} Servers`];
		
		client.user.setActivity(activities.join(' | '), { type: 'PLAYING' });
		setInterval(() => {
			client.user.setActivity(activities.join(' | '), { type: 'PLAYING' });
		}, 3 * 60000);

		if (await db.startsWith('muted_')) {
			const muteds = await db.startsWith('muted_');

			for (muted of muteds) {
				const roleid = await db.fetch('muterole_' + muted.guildID);
				if (roleid) {
					if (muted.time - parseInt(Date.now()) < 0) {
						const role = client.guilds.cache.get(muted.guildID)
							.roles.cache.find((role) => role.id == roleid);

						await muted.roles.forEach((r) => {
							return client.guilds.cache.get(muted.guildID).members.cache.get(muted.id).roles.add(r);
						});
						
						await client.guilds.cache.get(muted.guildID).members.cache.get(muted.id).roles.remove(role);

						await db.delete(`muted_${muted.id}_${muted.guildID}`);

						if (await db.fetch('logch_' + muted.guildID)) {
							const logchannelid = await db.fetch('logch_' + muted.guildID);
							const logchannel = client.guilds.cache.get(muted.guildID)
								.channels.cache.find((channel) => channel.id == logchannelid);
							const embed = {
								color: 0x30b5f2,
								title: translate(logchannel, 'commands.mute.messages.muteRemovedTitle'),
								description: translate(logchannel, 'commands.mute.messages.muteRemovedDescription', muted.id)
							};
							logchannel.send({ embed: embed });
						}
					} else {
						setTimeout(async () => {
							const role = client.guilds.cache.get(muted.guildID)
								.roles.cache.find((role) => role.id == roleid);

							await muted.roles.forEach((r) => {
								return client.guilds.cache.get(muted.guildID).members.cache.get(muted.id).roles.add(r);
							});
							
							await client.guilds.cache.get(muted.guildID).members.cache.get(muted.id).roles.remove(role);

							await db.delete(`muted_${muted.id}_${muted.guildID}`);
							
							if (await db.fetch('logch_' + muted.guildID)) {
								const logchannelid = await db.fetch('logch_' + muted.guildID);
								const logchannel = client.guilds.cache.get(muted.guildID)
									.channels.cache.find((channel) => channel.id == logchannelid);
								const embed = {
									color: 0xe60ffa,
									title: translate(logchannel, 'commands.mute.messages.muteRemovedTitle'),
									description: translate(logchannel, 'commands.mute.messages.muteRemovedDescription', muted.id)
								};
								logchannel.send({ embed: embed });
							}
						}, muted.time - parseInt(Date.now()));
					}
				}
			}
		}
	}
};
