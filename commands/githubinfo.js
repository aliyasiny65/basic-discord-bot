const translate = require('../language/translate');
const Discord = require('discord.js');
const githubUser = require('github-api-user');

module.exports = {
	name: 'githubinfo',
	description: null,
	aliases: ['githubuserinfo', "githubprofile"],
	permissions: null,
	async run(message, args, bot) {
        var ghName = args.slice(0).join(' ')

        if (ghName.length < 2) {
          const lengtherr = new Discord.MessageEmbed()
            .setColor(0x30b5f2)
            .setTitle(translate(message, 'commands.githubinfo.messages.errormsg'))
            .setDescription(translate(message, 'commands.githubinfo.messages.usernameshort'));
          return message.channel.send(lengtherr);
        };
      
        const usernameerr = new Discord.MessageEmbed()
          .setColor(0x30b5f2)
          .setTitle(translate(message, 'commands.githubinfo.messages.errormsg'))
          .setDescription(translate(message, 'commands.githubinfo.messages.usernotfound'))
      
        githubUser(`${ghName}`).then(user => {
          if (user.name == null) {
            var ghnamee = (translate(message, 'commands.githubinfo.messages.notfound'))
          } else {
            var ghnamee = user.name
          }
          if (user.company == null) {
            var ghcompany = (translate(message, 'commands.githubinfo.messages.notfound'))
          } else {
            var ghcompany = user.company
          }
          if (user.location == null) {
            var ghlocation = (translate(message, 'commands.githubinfo.messages.notfound'))
          } else {
            var ghlocation = user.location
          }
          if (user.mail == null) {
            var ghmail = (translate(message, 'commands.githubinfo.messages.notfound'))
          } else {
            var ghmail = user.mail
          }
          if (user.bio == null) {
            var ghbio = (translate(message, 'commands.githubinfo.messages.notfound'))
          } else {
            var ghbio = user.bio
          }
          const profile = new Discord.MessageEmbed()
            .setColor(0x30b5f2)
            .setTitle(`Github Profile`)
            .setURL(`https://github.com/${ghName}`)
            .setAuthor(`${ghName}'s`, user.avatar_url, `https://github.com/${ghName}`)
            .setThumbnail(user.avatar_url)
            .addFields({
              name: (translate(message, 'commands.githubinfo.messages.nick')),
              value: ghnamee,
              inline: true
            }, {
              name: (translate(message, 'commands.githubinfo.messages.company')),
              value: ghcompany,
              inline: true
            }, {
              name: (translate(message, 'commands.githubinfo.messages.location')),
              value: ghlocation,
              inline: true
            }, {
              name: (translate(message, 'commands.githubinfo.messages.mail')),
              value: ghmail,
              inline: true
            }, {
              name: (translate(message, 'commands.githubinfo.messages.bio')),
              value: ghbio,
              inline: true
            }, )
            .setTimestamp()
            .setFooter(`${message.author.tag}`, message.author.displayAvatarURL({
              dynamic: true,
              size: 4096,
              format: 'png'
            }));
      
          message.channel.send(profile)
      
        }).catch(err => message.channel.send(usernameerr));
	}
};
