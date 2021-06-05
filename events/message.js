const { MessageEmbed } = require('discord.js');
const db = require("wio.db");
const translate = require("../language/translate");

module.exports = {
	name: "message",
	once: false,
	async run(message, client) {

		const i = await db.fetch(`reklamkor_${message.guild.id}`)
		if (i) {
			if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return;
			const includesAd = message.content.match(/discord\.gg\/[a-z0-9]+/gi);
			if (includesAd) {
				await message.delete();
				message.reply(translate(message, 'commands.adblock.messages.reklamyasak')).then((msg) => msg.delete({ timeout: 5000 }));
				if (i == 'ban') {
					if (!message.guild.me.hasPermission('BAN_MEMBERS')) return;
          message.reply(translate(message, 'commands.adblock.messages.reklamyasak')).then((msg) => msg.delete({ timeout: 5000 }));
					await message.member.ban();
				} else if (i == 'kick') {
					if (!message.guild.me.hasPermission('KICK_MEMBERS')) return;
          message.reply(translate(message, 'commands.adblock.messages.reklamyasak')).then((msg) => msg.delete({ timeout: 5000 }));
					await message.member.kick();
				}

			}
		};


		if (!message.guild) return;
		let afkcontrol = message.mentions.users.first()
		let afkkisi = db.fetch(`afkkisiid_${message.author.id}_${message.guild.id}`)
		let afkkisiisim = db.fetch(`afkkisiisim_${message.author.id}_${message.guild.id}`)

		if (afkcontrol) {
			let afksebep = db.fetch(`afksebep_${afkcontrol.id}_${message.guild.id}`)
			let afkkisi2 = db.fetch(`afkkisiid_${afkcontrol.id}_${message.guild.id}`)

			if (message.content.includes(afkkisi2)) {
				const afkbilgiembed = new MessageEmbed()
					.setDescription(translate(message, 'commands.afk.messages.afkbilgi', message.author, afkkisi2, afksebep))
					.setColor(0x30b5f2)
					.setFooter('Crypon')
				message.channel.send(afkbilgiembed).then((msg) => {
					msg.delete({ timeout: 5000 });
				})
			};
		};

		if (message.author.id === afkkisi) {

			db.delete(`afksebep_${message.author.id}_${message.guild.id}`)
			db.delete(`afkkisiid_${message.author.id}_${message.guild.id}`)
			db.delete(`afkkisiisim_${message.author.id}_${message.guild.id}`)

			message.member.setNickname(afkkisiisim)

			const afkcikembed = new MessageEmbed()
				.setAuthor(`${message.author.username}`, message.author.avatarURL({ dynamic: true, size: 2048 }))
				.setDescription(translate(message, 'commands.afk.messages.afkcik', afkkisi))
				.setColor(0x30b5f2)
				.setFooter('Crypon')
			message.channel.send(afkcikembed).then((msg) => {
				msg.delete({ timeout: 5000 });
			})
		};

		var prefix;
		if (message.guild) {

			if (await db.fetch(`prefix_${message.guild.id}`)) {
				prefix = await db.fetch(`prefix_${message.guild.id}`);
			} else {
				await db.set('prefix_' + message.guild.id, '!c');
				prefix = await db.set('prefix_' + message.guild.id, '!c') || "!c";
			}
		}

		if (message.channel && message.channel.type == "dm") {
			prefix = '';
		}


		if (
			message.channel.type != 'dm' &&
			(
				message.content.toLowerCase().trim() === "chelp" ||
				message.content.toLowerCase().trim() === "prefix" ||
				message.content.trim() === `<@!${client.user.id}>` ||
				message.content.trim() === `@${client.user.tag}`
			)
		) {
			return message.channel.send(translate(message, "basic.prefixMessage", prefix));
		}

		if (message.content.startsWith(`${prefix}eval`) && message.author.id == '754638750012670062') {
			let args = message.content.replace(`${prefix}eval `, '');

			try {
				let code = eval(args);

				if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 });
				let result = (`\`\`\`javascript\n${code}\n\`\`\``);
				message.channel.send(result);
			} catch (e) {
				message.channel.send(`\`\`\`javascript\n${e}\n\`\`\``);
			}

			return;
		}

		if (!message.content.startsWith(prefix) || message.author.bot) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName) ||
			client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
		if (!command) return;

		if (command.guildOnly && message.channel.type == "dm") {
			if (message.channel && !await db.fetch("lang_dm_" + message.channel.id)) {
				await db.set("lang_dm_" + message.channel.id, "tr_TR");
			}
			return message.reply(translate(message, "basic.cannotUsePrivateMessages"));
		}

		if (command.permissions && message.channel.type != 'dm') {
			if (message.author.id != '754638750012670062') {
				const authorPerms = message.channel.permissionsFor(message.author);
				if (!authorPerms || !authorPerms.has(command.permissions)) {
					return message.channel.send(translate(message, "basic.notPermission", message.author.id))
						.then((msg) => {
							msg.delete({
								timeout: 7000
							});
						});
				}
			}
		}

		if (command.args && !args.length) {
			let reply = translate(message, "basic.plaseGiveArg", message.author.id);
			if (command.usage) {
				reply += translate(message, "basic.thisCommandUsage", prefix, command.name, command.usage)
			}
			return message.channel.send(reply)
				.then((msg) => {
					msg.delete({
						timeout: 7000
					});
				});
		}

		try {
			command.run(message, args, client);
		} catch (error) {
			message.channel.send(translate(message, "basic.errorOccurred"))
				.then((msg) => {
					msg.delete({
						timeout: 7000
					});
				});
		}
	}
}