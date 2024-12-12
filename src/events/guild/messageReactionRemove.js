import { RoleMessage, ReactionRole } from '../../database/models/index.js';
import logger from '../../utils/logger.js';

export default {
    name: 'messageReactionRemove',
    once: false,

    async execute(reaction, user) {
        if (user.bot) return;

        try {
            if (reaction.partial) {
                await reaction.fetch();
            }

            const roleMessage = await RoleMessage.findOne({
                where: { messageId: reaction.message.id }
            });

            if (!roleMessage) return;

            const reactionRole = await ReactionRole.findOne({
                where: {
                    messageId: reaction.message.id,
                    emoji: reaction.emoji.name
                }
            });

            if (!reactionRole) return;

            const member = await reaction.message.guild.members.fetch(user.id);
            await member.roles.remove(reactionRole.roleId);

            logger.info(`Rol ${reactionRole.roleId} removido de ${user.tag} en ${reaction.message.guild.name}`);
        } catch (error) {
            logger.error(`Error al remover rol: ${error.message}`);
        }
    }
}; 