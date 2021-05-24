const translate = require('../language/translate');

module.exports = {
    name: "fakemesaj",
    description: "O kullanıcı mesaj atmış gibi siz atarsınız.",
    aliases: ["fakemesaj", "sahtemesaj", "fakemessage"],
    permissions: null,
    async run(message, args, client) {
    const user = message.mentions.users.first()
    if(!user) return message.channel.send(translate(message, 'commands.fakemesaj.membernotexited'))
    if(user.bot) return message.channsel.send(translate(message, 'commands.fakemesaj.memberisbot'))
    if(!args[1]) return message.channel.send(translate(message, 'commands.fakemesaj.pleaseargs'))
    let mesaj = args.slice(1).join(' ');
    message.delete()
    const webhook = await message.channel.createWebhook(user.username, {
      avatar: user.displayAvatarURL()
    }) 
    webhook.send(mesaj)
    setTimeout(() => {
      webhook.delete()
    }, 500)
}};
