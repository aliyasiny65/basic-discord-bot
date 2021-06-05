const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
	name: 'setnickname',
	description: null,
	aliases: ['setnick', 'takmaad'],
	args: true,
	usage: null,
	guildOnly: true,
	permissions: 'CHANGE_NICKNAME',
	async run(message, args, client) {
		this.description = translate(message, 'commands.setnickname.description');
		this.usage = translate(message, 'commands.setnickname.usage');

		if (!args.length || args.length < 2) {
			return message.reply(translate(message, 'commands.setnickname.messages.maxArgs')).then((msg) => {
				msg.delete({ timeout: 5000 });
			});
		}

		let memberid;
		if (message.mentions.members.size) {
			memberid = message.mentions.members.first().id;
		} else if (args[0] && args[0].length == 18 && args[0].match(/(\d){18}/)) {
			memberid = args[0];
		} else {
			memberid = message.author.id;
		}

		let member = message.guild.members.cache.find((member) => member.id == memberid);

		var nick = args.slice(1).join(' ').toString();
		if (nick.startsWith("<@!")) {
			nick = args.slice(0, args.length - 1).join(' ').toString();
		}

		if (!member) {
			const prefix = await db.fetch('prefix_' + message.guild.id);
			return message.channel
				.send(
					translate(
						message,
						'commands.setnickname.messages.memberNotExists',
						memberid,
						prefix,
						this.name,
						this.usage
					)
				)
				.then((msg) => {
					msg.delete({ timeout: 10000 });
				});
		}

		if (member.id == message.guild.ownerID) {
			return message.channel.send(translate(message, 'commands.setnickname.messages.isAdmin'))
				.then((msg) => {
					msg.delete({ timeout: 5000 });
				});
		}

		if (!nick || nick.trim() == '') {
			return message.reply(translate(message, "commands.setnickname.messages.enterNickname"));
		}

		member.setNickname(nick)
			.then((member) => {
				message.channel.send(translate(message, "commands.setnickname.messages.successful", member.id, nick))
					.then((msg) => {
						msg.delete({ timeout: 5000 });
					});
			}).catch((error) => {
				console.error(error);
				message.channel.send(translate(message, "commands.setnickname.messages.errorOccurred"));
			});
	},
};
