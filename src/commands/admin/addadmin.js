import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { AdminUser } from '../../database/models/index.js';
import { checkPermissions } from '../../utils/checkPermissions.js';
import { isSuperUser } from '../../utils/checkSuperUser.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('addadmin')
        .setDescription('Añade un administrador del bot')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a convertir en administrador')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('rol')
                .setDescription('Rol a asignar')
                .setRequired(true)
                .addChoices(
                    { name: 'Administrador', value: 'ADMIN' },
                    { name: 'Moderador', value: 'MODERATOR' }
                )
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
            const role = interaction.options.getString('rol');

            // Verificar si el usuario ya es admin
            const existingAdmin = await AdminUser.findOne({
                where: { userId: targetUser.id }
            });

            if (existingAdmin) {
                return interaction.reply({
                    content: '❌ Este usuario ya es administrador del bot.',
                    ephemeral: true
                });
            }

            // Crear nuevo admin
            await AdminUser.create({
                userId: targetUser.id,
                username: targetUser.tag,
                role: role,
                addedBy: interaction.user.id
            });

            await interaction.reply({
                content: `✅ ${targetUser.tag} ha sido añadido como ${role === 'ADMIN' ? 'administrador' : 'moderador'} del bot.`,
                ephemeral: true
            });

            logger.info(`Nuevo ${role} añadido: ${targetUser.tag} por ${interaction.user.tag}`);
        } catch (error) {
            logger.error(`Error al añadir admin: ${error.message}`);
            await interaction.reply({
                content: '❌ Hubo un error al añadir el administrador.',
                ephemeral: true
            });
        }
    }
}; 