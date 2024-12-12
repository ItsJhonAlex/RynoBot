import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { RoleMessage, ReactionRole } from '../../database/models/index.js';
import { checkPermissions } from '../../utils/checkPermissions.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('setverify')
        .setDescription('Configura el sistema de verificación')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal donde se enviará el mensaje de verificación')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Rol que se otorgará al verificarse')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            // Verificar permisos
            if (!(await checkPermissions(interaction.user.id, 'ADMIN'))) {
                return await interaction.editReply({
                    content: '❌ Solo los administradores pueden configurar el sistema de verificación.'
                });
            }

            const channel = interaction.options.getChannel('canal');
            const role = interaction.options.getRole('rol');

            // Verificar permisos del bot
            const permissions = channel.permissionsFor(interaction.client.user);
            if (!permissions.has(['SendMessages', 'ViewChannel', 'ManageRoles'])) {
                return await interaction.editReply({
                    content: '❌ No tengo los permisos necesarios en el canal o para manejar roles.'
                });
            }

            // Crear embed de verificación
            const verifyEmbed = new EmbedBuilder()
                .setColor(0x2ECC71)
                .setTitle('✅ Verificación del Servidor')
                .setDescription(
                    '¡Bienvenido al servidor!\n\n' +
                    'Para acceder al resto de canales, por favor reacciona a este mensaje con ✅\n\n' +
                    '> Al verificarte, aceptas seguir las reglas del servidor.'
                )
                .setFooter({ 
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL()
                })
                .setTimestamp();

            // Enviar mensaje de verificación
            const verifyMessage = await channel.send({
                embeds: [verifyEmbed]
            });

            // Añadir reacción
            await verifyMessage.react('✅');

            // Guardar en la base de datos
            const roleMessage = await RoleMessage.create({
                messageId: verifyMessage.id,
                guildId: interaction.guild.id,
                channelId: channel.id,
                title: 'Verificación',
                description: 'Sistema de verificación',
                createdBy: interaction.user.id
            });

            await ReactionRole.create({
                messageId: verifyMessage.id,
                roleId: role.id,
                emoji: '✅',
                description: 'Rol de verificación',
                isExclusive: true
            });

            await interaction.editReply({
                content: `✅ Sistema de verificación configurado en ${channel}\nRol asignado: ${role.name}`
            });

            logger.info(`Sistema de verificación configurado en ${interaction.guild.name} por ${interaction.user.tag}`);
        } catch (error) {
            logger.error(`Error al configurar verificación: ${error.message}`);
            await interaction.editReply({
                content: '❌ Hubo un error al configurar el sistema de verificación.'
            });
        }
    }
}; 