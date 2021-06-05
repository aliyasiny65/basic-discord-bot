const translate = require('../language/translate');

module.exports = {
	name: 'hack',
	description: null,
	aliases: ['hack', "hackle"],
	async run(message, args, client) {
  if(!args[0]) return message.channel.send(translate(message, 'commands.hack.messages.plsmember'))

  const email = ["progamer@gmail.com", "test@gmail.com", "ghasdjhdsa@gmail.com", "minecrafter331@hotmail.com"]
  const emailrandom = email[Math.floor(Math.random() * email.length)];
  const sifre = ["1234", "123abc", "progamer123", "1234abc", "freeaccount", "minecrafterpro123"]
  const sifrerandom = sifre[Math.floor(Math.random() * sifre.length)];

  let kisi = message.mentions.members.first()
  let kisiid = message.mentions.members.first().id
  if(kisiid === message.author.id) return message.channel.send(translate(message, 'commands.hack.messages.membernotyouerself'))
  message.channel.send(translate(message, 'commands.hack.messages.hacking', kisiid)).then((msg) => {
                        setTimeout(function() {
                        msg.edit(translate(message, 'commands.hack.messages.hackpasw'))
                        .then((msg) => {
                        setTimeout(function() {
                        msg.edit(translate(message, 'commands.hack.messages.hackcomplete', kisiid, emailrandom, sifrerandom))
                    }, 6000);
});
                    }, 4000)
});
}};