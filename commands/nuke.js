const translate = require('../language/translate');
const Discord = require("discord.js");

module.exports = {
	name: 'nuke',
	description: null,
	aliases: ['channelnuke'],
	guildOnly: true,
	permissions: "MANAGE_CHANNELS",
	async run(message, args, bot) {
        message.channel.messages.fetch().then((results) => {
            message.channel.bulkDelete(results)
          });
        const nukeembed = new Discord.MessageEmbed()
        .setColor(0x30b5f2)
        .setTitle(translate(message, 'commands.nuke.messages.successtitle'))
        .setDescription(translate(message, 'commands.nuke.messages.successdescription', message.author))
        .setFooter(`${message.author.tag}`)
        .setTimestamp(Date.now())
      message.channel.send(nukeembed)
    }
};
