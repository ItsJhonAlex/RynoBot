import { RoleMessage, ReactionRole } from '../../database/models/index.js';
import logger from '../../utils/logger.js';

export default {
    name: 'messageReactionAdd',
    once: false,

    async execute(reaction, user) {
        // Ignorar reacciones de bots
        if (user.bot) return;

        try {
            // Si la reacción es parcial, obtener el mensaje completo
            if (reaction.partial) {
                await reaction.fetch();
            }

            // Buscar el mensaje en la base de datos
            const roleMessage = await RoleMessage.findOne({
                where: { messageId: reaction.message.id }
            });

            if (!roleMessage) return;

            // Buscar el rol asociado a la reacción
            const reactionRole = await ReactionRole.findOne({
                where: {
                    messageId: reaction.message.id,
                    emoji: reaction.emoji.name
                }
            });

            if (!reactionRole) return;

            // Obtener el miembro
            const member = await reaction.message.guild.members.fetch(user.id);
            
            // Asignar el rol
            await member.roles.add(reactionRole.roleId);

            logger.info(`Rol ${reactionRole.roleId} asignado a ${user.tag} en ${reaction.message.guild.name}`);
        } catch (error) {
            logger.error(`Error al manejar reacción: ${error.message}`);
        }
    }
}; 