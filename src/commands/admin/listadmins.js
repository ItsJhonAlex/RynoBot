import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { AdminUser } from '../../database/models/index.js';
import { checkPermissions } from '../../utils/checkPermissions.js';
import { isSuperUser } from '../../utils/checkSuperUser.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('listadmins')
        .setDescription('Muestra la lista de administradores del bot')
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

            const admins = await AdminUser.findAll();

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('📑 Administradores del Bot')
                .setDescription('Lista de usuarios con permisos administrativos')
                .addFields(
                    admins.map(admin => ({
                        name: admin.username,
                        value: `Rol: ${admin.role}\nID: ${admin.userId}\nAgregado por: <@${admin.addedBy}>`,
                        inline: true
                    }))
                )
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

            logger.info(`Lista de admins solicitada por ${interaction.user.tag}`);
        } catch (error) {
            logger.error(`Error al listar admins: ${error.message}`);
            await interaction.reply({
                content: '❌ Hubo un error al obtener la lista de administradores.',
                ephemeral: true
            });
        }
    }
}; 