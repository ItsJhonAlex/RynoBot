import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { AdminUser } from '../../database/models/index.js';
import { checkPermissions } from '../../utils/checkPermissions.js';
import { isSuperUser } from '../../utils/checkSuperUser.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('removeadmin')
        .setDescription('Remueve un administrador del bot')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a remover como administrador')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            // Verificar si es super usuario o admin
            if (!isSuperUser(interaction.user.id) && !(await checkPermissions(interaction.user.id, 'ADMIN'))) {
                return interaction.reply({
                    content: '❌ No tienes permisos para usar este comando.',
                    ephemeral: true
                });
            }

            const targetUser = interaction.options.getUser('usuario');

            // Evitar que se remueva al super usuario
            if (isSuperUser(targetUser.id)) {
                return interaction.reply({
                    content: '❌ No puedes remover al super usuario.',
                    ephemeral: true
                });
            }

            // Verificar si el usuario es admin
            const adminUser = await AdminUser.findOne({
                where: { userId: targetUser.id }
            });

            if (!adminUser) {
                return interaction.reply({
                    content: '❌ Este usuario no es administrador del bot.',
                    ephemeral: true
                });
            }

            // Eliminar admin
            await adminUser.destroy();

            await interaction.reply({
                content: `✅ ${targetUser.tag} ya no es administrador del bot.`,
                ephemeral: true
            });

            logger.info(`Admin removido: ${targetUser.tag} por ${interaction.user.tag}`);
        } catch (error) {
            logger.error(`Error al remover admin: ${error.message}`);
            await interaction.reply({
                content: '❌ Hubo un error al remover el administrador.',
                ephemeral: true
            });
        }
    }
}; 