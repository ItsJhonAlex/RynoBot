import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { GuildConfig } from '../../database/models/index.js';
import { checkPermissions } from '../../utils/checkPermissions.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('togglewelcome')
        .setDescription('Activa o desactiva el sistema de bienvenida')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            // Verificar permisos de administrador
            if (!(await checkPermissions(interaction.user.id, 'ADMIN'))) {
                return await interaction.editReply({
                    content: '❌ Solo los administradores pueden modificar el sistema de bienvenida.'
                });
            }

            // Obtener o crear configuración
            const [guildConfig] = await GuildConfig.findOrCreate({
                where: { guildId: interaction.guild.id },
                defaults: { welcomeEnabled: true }
            });

            // Cambiar estado
            const newState = !guildConfig.welcomeEnabled;
            await guildConfig.update({ welcomeEnabled: newState });

            await interaction.editReply({
                content: `✅ Sistema de bienvenida ${newState ? 'activado' : 'desactivado'}.`
            });

            logger.info(`Sistema de bienvenida ${newState ? 'activado' : 'desactivado'} en ${interaction.guild.name} por ${interaction.user.tag}`);
        } catch (error) {
            logger.error(`Error al cambiar estado de bienvenida: ${error.message}`);
            await interaction.editReply({
                content: '❌ Hubo un error al modificar el sistema de bienvenida.'
            });
        }
    }
}; 