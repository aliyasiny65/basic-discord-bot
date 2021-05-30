const Discord = require('discord.js');
const db = require('wio.db');
const translate = require('../language/translate');

module.exports = {
	name: 'message',
	once: false,
	async run(message) {
	if(!message.guild) return;
		let afkcontrol = message.mentions.users.first()
		let afkkisi = db.fetch(`afkkisiid_${message.author.id}_${message.guild.id}`)
		let afkkisiisim = db.fetch(`afkkisiisim_${message.author.id}_${message.guild.id}`)
	  
		if(afkcontrol){
		  let afksebep = db.fetch(`afksebep_${afkcontrol.id}_${message.guild.id}`)
		  let afkkisi2 = db.fetch(`afkkisiid_${afkcontrol.id}_${message.guild.id}`)
	  
		  if(message.content.includes(afkkisi2)){
			const afkbilgiembed = new Discord.MessageEmbed()
			.setDescription(translate(message, 'commands.afk.messages.afkbilgi', message.author, afkkisi2, afksebep))
			.setColor(0x30b5f2)
			.setFooter('Crypon')
			message.channel.send(afkbilgiembed).then((msg) => {
        msg.delete({ timeout: 5000 });
      })};
		};

		if(message.author.id === afkkisi){
	  
		  db.delete(`afksebep_${message.author.id}_${message.guild.id}`)
		  db.delete(`afkkisiid_${message.author.id}_${message.guild.id}`)
		  db.delete(`afkkisiisim_${message.author.id}_${message.guild.id}`)
	  
		  message.member.setNickname(afkkisiisim)
	  
		  const afkcikembed = new Discord.MessageEmbed()
		  .setAuthor(`${message.author.username}`, message.author.avatarURL({dynamic: true, size: 2048}))
		  .setDescription(translate(message, 'commands.afk.messages.afkcik', afkkisi))
		  .setColor(0x30b5f2)
		  .setFooter('Crypon')
		  message.channel.send(afkcikembed).then((msg) => {
    msg.delete({ timeout: 5000 });
})};
}};
