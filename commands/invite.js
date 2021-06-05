const translate = require('../language/translate');

module.exports = {
	name: 'invite',
	description: null,
	aliases: ['inv', 'davet'],
	args: false,
	usage: null,
	guildOnly: false,
	permissions: null,
	run(message, args, client) {
		this.description = translate(message, 'commands.invite.description');
		const messageEmbed = {
			color: 0x30b5f2,
			author: {
				name: 'Crypon',
				icon_url: 'https://cdn.discordapp.com/avatars/815184711416152094/7f9f4158987a181843ee9a8a2b70ef24.png?size=1024',
			},
			description: translate(message, 'commands.invite.messages.inviteEmbed'),
		};

		message.channel.send({ embed: messageEmbed });
	},
};
