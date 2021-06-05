const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
	name: 'setprefix',
	description: null,
	aliases: ['sprefix', 'setpref', 'prefixayarla'],
	args: true,
	usage: null,
	guildOnly: true,
	permissions: 'MANAGE_MESSAGES',
	async run(message, args, client) {
		this.description = translate(message, 'commands.setprefix.description');
		this.usage = translate(message, 'commands.setprefix.usage');

		if (args[0].length > 4) {
			return message.channel.send(translate(message, 'commands.setprefix.messages.maxLength'))
				.then((msg) => {
					msg.delete({ timeout: 7000 });
				});
		}

        if (message.guild) {
            await db.set('prefix_' + message.guild.id, args[0]);
		message.channel
			.send(translate(message, 'commands.setprefix.messages.successful', args[0]))
				.then((msg) => {
					msg.delete({ timeout: 5000 });
				});	
        } else if (message.channel.type == "dm") {
        	await db.set('prefix_dm_' + message.channel.id, args[0]);
		message.channel
			.send(translate(message, 'commands.setprefix.messages.successful', args[0]))
				.then((msg) => {
					msg.delete({ timeout: 5000 });
				});
        }
	},
};
