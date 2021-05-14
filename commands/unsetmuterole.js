const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
	name: 'unsetmuterole',
	description: null,
	aliases: ['unmuterole', 'susturmarolusil'],
	args: false,
	usage: null,
	guildOnly: true,
	permissions: 'MANAGE_ROLES',
	async run(message, args, client) {
		this.description = translate(message, 'commands.unsetmuterole.description');
		this.usage = translate(message, 'commands.unsetmuterole.usage');

		if (await db.fetch('muterole_' + message.guild.id)) {
			try {
				await db.delete('muterole_' + message.guild.id);
				return message.channel
					.send(translate(message, 'commands.unsetmuterole.messages.successful'))
					.then((msg) => {
						msg.delete({ timeout: 5000 });
					});
			} catch (error) {
				console.error(error);
				return message.channel
					.send(translate(message, 'commands.unsetmuterole.messages.errorOccurred'))
					.then((msg) => {
						msg.delete({ timeout: 5000 });
					});
			}
		} else {
			return message.channel
				.send(translate(message, 'commands.unsetmuterole.messages.roleNotSelected'))
				.then((msg) => {
					msg.delete({ timeout: 5000 });
				});
		}
	},
};
