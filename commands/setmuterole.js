const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
	name: 'setmuterole',
	description: null,
	aliases: ['muterole', 'susturmarolu'],
	args: true,
	usage: null,
	guildOnly: true,
	permissions: 'MANAGE_ROLES',
	async run(message, args, client) {
		this.description = translate(message, 'commands.setmuterole.description');
		this.usage = translate(message, 'commands.setmuterole.usage');

		if (message.mentions.roles.size) {
			const roleid = message.mentions.roles.first().id;
			const role = message.guild.roles.cache.find((role) => role.id == roleid);
			await db.set('muterole_' + message.guild.id, roleid);
			return message.channel.send(translate(message, 'commands.setmuterole.messages.successful', role))
				.then((msg) => {
					msg.delete({ timeout: 5000 });
				});
		} else {
			return message.channel.send(translate(message, 'commands.setmuterole.messages.tagARole'))
				.then((msg) => {
					msg.delete({ timeout: 5000 });
				});
		}
	}
};
