import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra la latencia del bot'),
    
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const latency = Date.now() - interaction.createdTimestamp;
            const apiLatency = Math.round(client.ws.ping);

            // Crear el embed
            const embedPing = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('🏓 Pong!')
                .setDescription('Información de latencia del bot')
                .addFields(
                    { 
                        name: '📊 Latencia del Bot', 
                        value: `\`${latency}ms\``, 
                        inline: true 
                    },
                    { 
                        name: '🌐 Latencia de la API', 
                        value: `\`${apiLatency}ms\``, 
                        inline: true 
                    }
                )
                .setFooter({ 
                    text: 'Este mensaje se eliminará en 30 segundos',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.editReply({
                embeds: [embedPing]
            });

            // Eliminar después de 30 segundos
            setTimeout(async () => {
                try {
                    await interaction.deleteReply();
                    logger.info(`Mensaje de ping eliminado después de 30 segundos`);
                } catch (error) {
                    logger.error(`Error al eliminar mensaje de ping: ${error.message}`);
                }
            }, 30000);

            logger.info(`Comando ping ejecutado - Latencia: ${latency}ms, API: ${apiLatency}ms`);
        } catch (error) {
            logger.error(`Error en comando ping: ${error.message}`);
            await interaction.editReply({
                content: '❌ Hubo un error al obtener la latencia.'
            });
        }
    }
}; 