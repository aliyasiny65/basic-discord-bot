const Discord = require("discord.js")
const translate = require('../language/translate');

module.exports = {
    name: "roles",
    description: "Sunucuda ki rolleri gösterir.",
    aliases: ["roles", "roller", "rolesinfo", "rolbilgi", "roleinfo"],
    permissions: null,
    async run(message, args, client) {
        const roller = new Discord.MessageEmbed()
        .setDescription(translate(message, 'commands.roles.messages.rolesembed', `\`${message.guild.roles.cache.size}\``, `${message.guild.roles.cache.map(r => `${r}`).join('\n ')}`))
        .setColor('RANDOM')
        message.channel.send(roller)
}};
