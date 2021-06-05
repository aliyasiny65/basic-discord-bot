const translate = require('../language/translate');

const resolveMS = (ms) => ms > 999 ? `${ms / 1000}s` : `${ms}ms`;

module.exports = {
	name: 'ping',
	description: null,
	aliases: ['botping'],
	args: false,
	usage: null,
	guildOnly: false,
	permissions: null,
	run(message, args, client) {
		this.description = translate(message, "commands.ping.description");
		this.usage = translate(message, "commands.ping.usage");

		let embed = {
			color: 0x30b5f2,
			description: translate(message, 'commands.ping.messages.calculating'),
		};

		return message.channel.send({ embed: embed })
			.then((msg) => {
				embed.description = translate(message, 'commands.ping.messages.ping', resolveMS(msg.createdTimestamp - message.createdTimestamp), resolveMS(client.ws.ping));
				msg.edit({ embed: embed });
			});
	},
};
