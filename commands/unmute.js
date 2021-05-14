const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
	name: 'unmute',
	description: null,
	aliases: ['susturma'],
	args: true,
	usage: null,
	guildOnly: true,
	permissions: 'MANAGE_MESSAGES',
	async run(message, args, client) {
		this.description = translate(message, 'commands.unmute.description');
		this.usage = translate(message, 'commands.unmute.usage');

		let memberid;
		if (message.mentions.members.size) {
			memberid = message.mentions.members.first().id;
		} else if (args[0] && args[0].length == 18) {
			memberid = args[0];
		} else {
			return message.channel.send(translate(message, 'commands.unmute.messages.memberNotFound'))
				.then((msg) => {
					msg.delete({ timeout: 5000 });
				});
		}

		const member = message.guild.members.cache.find((member) => member.id == memberid);

		if (await db.fetch(`muted_${memberid}_${message.guild.id}`) && await db.fetch(`muterole_${message.guild.id}`)) {
			try {
				const roleid = await db.fetch(`muterole_${message.guild.id}`);
				const role = message.guild.roles.cache.find((role) => role.id == roleid);
				member.roles.remove(role);
				await db.delete(`muted_${memberid}_${message.guild.id}`);
				return message.channel
					.send(translate(message, 'commands.unmute.messages.successful', memberid))
					.then(async (msg) => {
						msg.delete({ timeout: 5000 });
						if (await db.fetch('logch_' + message.guild.id)) {
							const logchannelid = await db.fetch('logch_' + message.guild.id);
							const logchannel = message.guild.channels.cache.find((channel) => channel.id == logchannelid);
							const embed = {
								color: 0x30b5f2,
								title: translate(message, 'commands.unmute.messages.embedTitle'),
								description: translate(message, 'commands.unmute.messages.embedDescription', memberid)
							};
							logchannel.send({ embed: embed });
						}
					});
			} catch (error) {
				console.error(error);
				return message.channel
					.send(translate(message, 'commands.unmute.messages.errorOccurred'))
					.then((msg) => {
						msg.delete({ timeout: 5000 });
					});
			}
		} else {
			return message.channel
				.send(translate(message, 'commands.unmute.messages.memberNotMuted'))
				.then((msg) => {
					msg.delete({ timeout: 5000 });
				});
		}
	}
};
