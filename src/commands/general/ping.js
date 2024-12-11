import { SlashCommandBuilder } from 'discord.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde con "Pong!"'),
    
    async execute(interaction, client) {
        try {
            const sent = await interaction.reply({ 
                content: 'Calculando ping...', 
                fetchReply: true 
            });

            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = Math.round(client.ws.ping);

            await interaction.editReply({
                content: `🏓 Pong!\n📊 Latencia: ${latency}ms\n🌐 API Latencia: ${apiLatency}ms`
            });

            logger.info(`Comando ping ejecutado - Latencia: ${latency}ms, API: ${apiLatency}ms`);
        } catch (error) {
            logger.error(`Error en comando ping: ${error.message}`);
            throw error; // Esto permitirá que el error sea manejado por interactionCreate
        }
    }
}; 