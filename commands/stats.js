const pretty = require('pretty-ms');
const byteSize = require('byte-size');
const os = require('os');
const translate = require('../language/translate');

module.exports = {
	name: 'stats',
	description: null,
	aliases: ['statistics', 'istatistik', 'istatistikler'],
	args: false,
	usage: null,
	guildOnly: false,
	permissions: null,
	run(message, args, client) {
		this.description = translate(message, 'commands.stats.description');
		this.usage = translate(message, 'commands.stats.usage');

		const totalGuild = client.guilds.cache.size;
		let totalMember = (client.users.cache.size).toLocaleString();
		const ping = `${client.ws.ping} ms`;

		const memoryUsageConv = byteSize(process.memoryUsage().heapUsed);
		const memoryUsage = `${memoryUsageConv.value}${memoryUsageConv.unit.toString().toUpperCase()}`;

		const totalMemoryConv = byteSize(os.totalmem());
		const totalMemory = `${totalMemoryConv.value}${totalMemoryConv.unit.toString().toUpperCase()}`;

		const uptime = pretty(client.uptime)
			.toString()
			.replace(/y/gi, ` ${translate(message, 'basic.date.year')}`)
			.replace(/d/gi, ` ${translate(message, 'basic.date.day')}`)
			.replace(/h/gi, ` ${translate(message, 'basic.date.hour')}`)
			.replace(/m/gi, ` ${translate(message, 'basic.date.minute')}`)
			.replace(/s$/gi, ` ${translate(message, 'basic.date.second')}`);

		let embed = {
			color: 0x30b5f2,
			title: translate(message, 'commands.stats.messages.embedTitle'),
			thumbnail: {
				url:
					client.user.displayAvatarURL(),
			},
			description: translate(
				message,
				'commands.stats.messages.embedDescription',
				totalGuild,
				totalMember,
				ping,
				os.cpus()[0].model,
				memoryUsage,
				totalMemory,
				uptime
			),
		};

		message.channel.send({ embed: embed });
	},
};
