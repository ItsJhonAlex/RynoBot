import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { RoleMessage, ReactionRole } from '../../database/models/index.js';
import { checkPermissions } from '../../utils/checkPermissions.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Añade un rol a un mensaje de roles')
        .addStringOption(option =>
            option.setName('mensaje_id')
                .setDescription('ID del mensaje de roles')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Rol a añadir')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Emoji para obtener el rol')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('descripcion')
                .setDescription('Descripción del rol')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('exclusivo')
                .setDescription('¿El rol es exclusivo? (no se puede tener junto con otros roles del mensaje)')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            // Verificar permisos
            if (!(await checkPermissions(interaction.user.id, 'ADMIN'))) {
                return await interaction.editReply({
                    content: '❌ Solo los administradores pueden añadir roles.'
                });
            }

            const messageId = interaction.options.getString('mensaje_id');
            const role = interaction.options.getRole('rol');
            const emoji = interaction.options.getString('emoji');
            const description = interaction.options.getString('descripcion');
            const isExclusive = interaction.options.getBoolean('exclusivo') || false;

            // Buscar el mensaje en la base de datos
            const roleMessage = await RoleMessage.findOne({
                where: { messageId: messageId }
            });

            if (!roleMessage) {
                return await interaction.editReply({
                    content: '❌ No se encontró el mensaje de roles especificado.'
                });
            }

            // Verificar si el rol ya está asignado
            const existingRole = await ReactionRole.findOne({
                where: {
                    messageId: messageId,
                    roleId: role.id
                }
            });

            if (existingRole) {
                return await interaction.editReply({
                    content: '❌ Este rol ya está asignado a este mensaje.'
                });
            }

            // Obtener el mensaje de Discord
            const channel = await interaction.guild.channels.fetch(roleMessage.channelId);
            const message = await channel.messages.fetch(messageId);

            // Añadir la reacción al mensaje
            await message.react(emoji);

            // Crear el rol en la base de datos
            await ReactionRole.create({
                messageId: messageId,
                roleId: role.id,
                emoji: emoji,
                description: description,
                isExclusive: isExclusive
            });

            // Actualizar el embed con el nuevo rol
            const roles = await ReactionRole.findAll({
                where: { messageId: messageId }
            });

            const updatedEmbed = EmbedBuilder.from(message.embeds[0])
                .setFields(
                    roles.map(role => ({
                        name: `${role.emoji} ${interaction.guild.roles.cache.get(role.roleId).name}`,
                        value: role.description,
                        inline: true
                    }))
                );

            await message.edit({ embeds: [updatedEmbed] });

            await interaction.editReply({
                content: `✅ Rol ${role.name} añadido con el emoji ${emoji}`
            });

            logger.info(`Rol ${role.name} añadido al mensaje ${messageId} por ${interaction.user.tag}`);
        } catch (error) {
            logger.error(`Error al añadir rol: ${error.message}`);
            await interaction.editReply({
                content: '❌ Hubo un error al añadir el rol.'
            });
        }
    }
}; 