import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { RoleMessage } from '../../database/models/index.js';
import { checkPermissions } from '../../utils/checkPermissions.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('createroles')
        .setDescription('Crea un mensaje para roles por reacción')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal donde se enviará el mensaje')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('titulo')
                .setDescription('Título del mensaje')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('descripcion')
                .setDescription('Descripción del mensaje')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            // Verificar permisos
            if (!(await checkPermissions(interaction.user.id, 'ADMIN'))) {
                return await interaction.editReply({
                    content: '❌ Solo los administradores pueden crear mensajes de roles.'
                });
            }

            const channel = interaction.options.getChannel('canal');
            const title = interaction.options.getString('titulo');
            const description = interaction.options.getString('descripcion');

            // Verificar permisos del bot
            const permissions = channel.permissionsFor(interaction.client.user);
            if (!permissions.has(['SendMessages', 'ViewChannel', 'ManageRoles'])) {
                return await interaction.editReply({
                    content: '❌ No tengo los permisos necesarios en el canal o para manejar roles.'
                });
            }

            // Crear embed
            const rolesEmbed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setTitle(title)
                .setDescription(description)
                .setFooter({ 
                    text: 'Reacciona para obtener un rol',
                    iconURL: interaction.guild.iconURL()
                })
                .setTimestamp();

            // Enviar mensaje
            const roleMessage = await channel.send({
                embeds: [rolesEmbed]
            });

            // Guardar en la base de datos
            await RoleMessage.create({
                messageId: roleMessage.id,
                guildId: interaction.guild.id,
                channelId: channel.id,
                title: title,
                description: description,
                createdBy: interaction.user.id
            });

            await interaction.editReply({
                content: `✅ Mensaje de roles creado en ${channel}\nUsa \`/addrole\` para añadir roles al mensaje.`
            });

            logger.info(`Mensaje de roles creado en ${interaction.guild.name} por ${interaction.user.tag}`);
        } catch (error) {
            logger.error(`Error al crear mensaje de roles: ${error.message}`);
            await interaction.editReply({
                content: '❌ Hubo un error al crear el mensaje de roles.'
            });
        }
    }
}; 