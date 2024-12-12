import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('testwelcome')
        .setDescription('Prueba el mensaje de bienvenida')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            // Obtener el evento guildMemberAdd
            const guildMemberAdd = interaction.client.events.get('guildMemberAdd');
            
            if (!guildMemberAdd) {
                return await interaction.editReply({
                    content: '❌ No se encontró el evento de bienvenida.'
                });
            }

            // Ejecutar el evento con el miembro que ejecutó el comando
            await guildMemberAdd.execute(interaction.member);

            await interaction.editReply({
                content: '✅ Mensaje de bienvenida de prueba enviado.'
            });
            
            logger.info(`Mensaje de bienvenida de prueba enviado por ${interaction.user.tag}`);
        } catch (error) {
            logger.error(`Error al probar mensaje de bienvenida: ${error.message}`);
            await interaction.editReply({
                content: '❌ Hubo un error al enviar el mensaje de prueba.'
            });
        }
    }
}; 