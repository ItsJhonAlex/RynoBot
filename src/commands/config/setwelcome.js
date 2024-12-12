import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { GuildConfig } from '../../database/models/index.js';
import { checkPermissions } from '../../utils/checkPermissions.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Configura el canal de bienvenida')
        .addChannelOption(option => 
            option.setName('canal')
                .setDescription('El canal donde se enviarán los mensajes de bienvenida')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('Mensaje personalizado de bienvenida')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // Diferir la respuesta inmediatamente
        await interaction.deferReply({ ephemeral: true });

        try {
            // Verificar permisos de administrador
            if (!(await checkPermissions(interaction.user.id, 'ADMIN'))) {
                return await interaction.editReply({
                    content: '❌ Solo los administradores pueden configurar el canal de bienvenida.'
                });
            }

            const channel = interaction.options.getChannel('canal');
            const customMessage = interaction.options.getString('mensaje');

            // Verificar permisos del bot en el canal
            const permissions = channel.permissionsFor(interaction.client.user);
            if (!permissions.has('SendMessages') || !permissions.has('ViewChannel')) {
                return await interaction.editReply({
                    content: '❌ No tengo los permisos necesarios en ese canal.'
                });
            }

            // Guardar o actualizar configuración en la base de datos
            await GuildConfig.upsert({
                guildId: interaction.guild.id,
                welcomeChannelId: channel.id,
                welcomeMessage: customMessage,
                welcomeEnabled: true
            });

            await interaction.editReply({
                content: `✅ Canal de bienvenida configurado a ${channel}\n${
                    customMessage ? `Mensaje personalizado: ${customMessage}` : ''
                }`
            });

            logger.info(`Canal de bienvenida configurado en ${interaction.guild.name} por ${interaction.user.tag}`);
        } catch (error) {
            logger.error(`Error al configurar canal de bienvenida: ${error.message}`);
            
            try {
                await interaction.editReply({
                    content: '❌ Hubo un error al configurar el canal de bienvenida.'
                });
            } catch (e) {
                logger.error(`Error adicional al responder: ${e.message}`);
            }
        }
    }
}; 