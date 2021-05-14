const { botName } = require('../config.json');
const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
	name: 'help',
	description: null,
	aliases: ['yardim'],
	args: false,
	usage: null,
	guildOnly: false,
	permissions: null,
	async run(message, args, client) {
		this.description = translate(message, 'commands.help.description');
		const { commands } = message.client;
		let _prefix;
		if (message.guild) {
			_prefix = await db.fetch('prefix_' + message.guild.id);
		} else if (message.channel && message.channel.type == "dm") {
			_prefix = await db.fetch('prefix_dm_' + message.channel.id);
		} else {
			_prefix = "!c"
		}
		
		let prefix = _prefix || "!c";

		let language;
		if (message.guild && await db.fetch('lang_' + message.guild.id)) {
			language = await db.fetch('lang_' + message.guild.id);
		} else if (
			message.channel &&
			message.channel.type == 'dm' &&
			await db.fetch('lang_dm_' + message.channel.id)
		) {
			language = await db.fetch('lang_dm_' + message.channel.id);
		} else {
			language = 'tr_TR';
		}

		const guildOrChannel = message.guild ? message.guild.name : null;
		let messageEmbed = {
			color: 0x30b5f2,
			title: translate(message, 'commands.help.messages.botCommandsTitle', botName),
			description: `${translate(message, 'commands.help.messages.listOfAllOfTheCommands')}\n\n${commands
				.map(
					(command) =>
						'`' +
						command.name +
						'`'
				)
				.join(' **|** ')}\n\n${translate(
				message,
				'commands.help.messages.moreDetailsWithGuild',
				guildOrChannel,
				prefix
			)}`,
		};

		if (!guildOrChannel) {
			messageEmbed.description = `${translate(message, 'commands.help.messages.listOfAllOfTheCommands')}\n\n${commands.map(
				(command) =>
					'`' +
					command.name +
					'`'
			).join(' **|** ')}\n\n${translate(message, 'commands.help.messages.moreDetails', prefix)}`;
		}

		if (!args.length) {
			return message.author
				.send({ embed: messageEmbed })
				.then((msg) => {
					if (message.channel.type == 'dm') return;
					message.reply(translate(message, 'commands.help.messages.iSentCommands')).then((msg) => {
						msg.delete({ timeout: 5000 });
					});
					message.delete();
				})
				.catch((err) => {
					return message.channel.send({ embed: messageEmbed }).catch((err) => {
						console.error(err);
						return message.reply(translate(message, 'commands.help.messages.errorOccurred')).then((msg) => {
							message.delete();
							msg.delete({ timeout: 5000 });
						});
					});
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

		if (!command) {
			message.delete();
			return message.reply(translate(message, 'commands.help.messages.commandNotFound')).then((msg) => {
				msg.delete({ timeout: 5000 });
			});
		}

		let commandEmbed = {
			color: 0x30b5f2,
			title: translate(message, 'commands.help.messages.commandTitle', command.name),
			description: translate(message, 'commands.help.messages.commandName', command.name),
		};

		if (command.aliases) {
			commandEmbed.description += `${translate(
				message,
				'commands.help.messages.commandAlternatives',
				command.aliases.join(', ')
			)}\n`;
		}
		if (translate(message, `commands.${command.name}.description`)) {
			commandEmbed.description += translate(
				message,
				'commands.help.messages.commandDescription',
				translate(message, `commands.${command.name}.description`)
			);
		}
		if (translate(message, `commands.${command.name}.usage`) != '') {
			commandEmbed.description += `${translate(
				message,
				`commands.help.messages.commandUsage`,
				prefix,
				command.name,
				translate(message, `commands.${command.name}.usage`)
			)}\n`;
		}

		message.channel.send({ embed: commandEmbed });
		message.delete();
	},
};
