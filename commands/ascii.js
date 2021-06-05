const Discord = require('discord.js');
var figlet = require('figlet');
const translate = require('../language/translate');

module.exports = {
	name: 'ascii',
	description: "Ascii art",
	aliases: ['ascii', 'asci', 'asciyaz', 'ascimesajyaz', 'asciiyaz'],
  permissions: null,
  async run(message, args, client) {
  if(args.join(' ').length > 75) return message.channel.send(translate(message, 'commands.ascii.messages.maxcharacter'));
     if(!args[0]) return message.channel.send(translate(message, 'commands.ascii.messages.plsargs'));
  
  figlet(`${args.join(' ')}`, function(err, data) {
      if (err) {
          console.log('ascii komutunda hata oluştu!');
          console.dir(err);
          return;
      };
      message.channel.send(`${data}`, {code: 'AsciiArt'});
  });
}};