const db = require('wio.db');
const dateFormat = require('dateformat');
const translate = require('../language/translate');

const isInteger = (num) => {
	return (num | 0) === num;
}

module.exports = {
	name: 'mute',
	description: null,
	aliases: ['sustur'],
	args: true,
	usage: null,
	guildOnly: true,
	permissions: "MANAGE_MESSAGES",
	async run(message, args, client) {
		this.description = translate(message, "commands.mute.description");
		this.usage = translate(message, "commands.mute.usage");

if (await db.fetch('muterole_' + message.guild.id)) {
	let memberid;
	if (message.mentions.members.size) {
		memberid = message.mentions.members.first().id;
	} else {
		memberid = args[0];
	}
	
	const member = message.guild.members.cache.find((member) => member.id == memberid);
	
	const roleid = await db.fetch(`muterole_${message.guild.id}`);
	const role = message.guild.roles.cache.find((role) => role.id == roleid);

	if (!member) {
		return message.channel.send(translate(message, 'commands.mute.messages.memberNotExists'))
			.then((msg) => {
				msg.delete({ timeout: 5000 });
			});
	}

	if (member.id == message.author.id) {
		return message.channel.send(translate(message, 'commands.mute.messages.cannotMuteYourself'))
			.then((msg) => {
				msg.delete({ timeout: 5000 });
			});
	}

	if (await db.fetch(`muted_${member.id}_${message.guild.id}`)) {
		return message.channel.send(translate(message, 'commands.mute.messages.memberAlreadyMuted'))
			.then((msg) => {
				msg.delete({ timeout: 5000 });
			});
	}

	let language;
	if (message.guild && (await db.fetch('lang_' + message.guild.id))) {
		language = await db.fetch('lang_' + message.guild.id);
	} else {
		language = 'tr_TR';
	}
	const datetimeConf = require(`../languages/${language}.json`).basic.date.datetime;
	dateFormat.i18n = {
		dayNames: datetimeConf.dayNames,
		monthNames: datetimeConf.monthNames,
		timeNames: datetimeConf.timeNames,
	};

	const time = args.slice(1, args.length);

	let minute;
	if (time.toString().match(/(\d)+\.*(\d)*m/i)) {
		minute =
			parseFloat(
				time
					.toString()
					.match(/(\d)+\.*(\d)*m/i)[0]
					.replace(/m/gi, '')
			) * 60000;
	} else {
		minute = 0;
	}

	let hour;
	if (time.toString().match(/(\d)+\.*(\d)*h/i)) {
		hour =
			parseFloat(
				time
					.toString()
					.match(/(\d)+\.*(\d)*h/i)[0]
					.replace(/h/gi, '')
			) * 3600000;
	} else {
		hour = 0;
	}

	let day;
	if (time.toString().match(/(\d)+\.*(\d)*d/i)) {
		day =
			parseFloat(
				time
					.toString()
					.match(/(\d)+\.*(\d)*d/i)[0]
					.replace(/d/gi, '')
			) * 86400000;
	} else {
		day = 0;
	}

	const resultTime = minute + hour + day;

	if (!isInteger(resultTime)) {
		return message.channel.send(translate(message, 'commands.mute.messages.enter32bit'))
			.then((msg) => {
				msg.delete({ timeout: 7000 });
			});
	}

	if (resultTime <= 5000) {
		return message.channel.send(translate(message, 'commands.mute.messages.writeValidTime'))
			.then((msg) => {
				msg.delete({ timeout: 7000 });
			});
	}

	const gmt = parseFloat(require(`../languages/${language}.json`).gmtTimeZone);
	
	let memberRoles = [];

	await member.roles.cache.map((r) => memberRoles.push(r.id));

	await member.roles.cache.map((r) => {
		return member.roles.remove(r)
			.catch((err) => {});
	});

	return member.roles.add(role).then(async (member) => {
		await db.set(`muted_${member.id}_${message.guild.id}`, {
			id: member.id,
			guildID: message.guild.id,
			time: parseInt(Date.now()) + resultTime,
			roles: memberRoles,
		});
		
		const date = new Date(parseInt(Date.now()) + resultTime + 7200000 + (gmt * 60000));
		const endTime = dateFormat(date, 'd mmmm dddd yyyy, h.MM.ss TT');

		let embed = {
			color: 0x30b5f2,
			title: translate(message, 'commands.mute.messages.memberMutedTitle', member.user.tag),
			description: translate(message, 'commands.mute.messages.memberMutedDescription', member.id),
			fields: [
				{
					name: translate(message, 'commands.mute.messages.endTime'),
					value: endTime
				}
			]
		};
		
		const logchannelid = await db.fetch('logch_' + message.guild.id);
		const logchannel = message.guild.channels.cache.find((channel) => channel.id == logchannelid);

		if (logchannel) {
			message.channel.send(translate(message, 'commands.mute.messages.successful', member.id))
				.then((msg) => {
					msg.delete({ timeout: 5000 });
				});
			logchannel.send({ embed: embed });
		} else {
			message.channel.send({ embed: embed });
		}
		
		setTimeout(async () => {
			await db.delete(`muted_${member.id}_${message.guild.id}`);

			await member.roles.remove(role);

			await memberRoles.forEach((r) => {
				return member.roles.add(r);
			});

			let logEmbed = {
				color: 0x30b5f2,
				title: translate(message, 'commands.mute.messages.muteRemovedTitle'),
				description: translate(message, 'commands.mute.messages.muteRemovedDescription', member.id)
			};
			
			logchannel.send({ embed: logEmbed });
		}, resultTime);
	});
} else {
	return message.channel.send(translate(message, 'commands.mute.messages.selectRole'))
		.then((msg) => {
			msg.delete({ timeout: 5000 });
		});
}
	},
};
