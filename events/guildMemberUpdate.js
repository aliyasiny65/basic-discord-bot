const db = require('wio.db');

module.exports = {
	name: 'guildMemberUpdate',
	once: false,
	async run(oldMember, newMember, client) {
		if (newMember.guild) {
			const muteRoleID = await db.fetch('muterole_' + newMember.guild.id);
			if (muteRoleID) {
				const muteRole = newMember.guild.roles.cache
					.find((role) => role.id == muteRoleID);
				
				newMember.roles.cache.map(async (role) => {
					if (
						role.id == muteRoleID &&
						await db.fetch(`muted_${newMember.id}_${newMember.guild.id}`)
					) {
						await db.delete(`muted_${newMember.id}_${newMember.guild.id}`);
					}
				});
			}
		}
	},
};
