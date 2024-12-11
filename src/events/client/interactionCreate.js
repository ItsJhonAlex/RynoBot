import logger from '../../utils/logger.js';

export default {
    name: 'interactionCreate',
    once: false,

    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            logger.error(`❌ No se encontró el comando ${interaction.commandName}`);
            return;
        }

        try {
            logger.info(`🎮 Comando ejecutado: ${interaction.commandName} por ${interaction.user.tag}`);
            await command.execute(interaction, client);
        } catch (error) {
            logger.error(`❌ Error ejecutando ${interaction.commandName}`);
            logger.error(`💥 Error: ${error.message}`);
            logger.error(`📜 Stack: ${error.stack}`);

            const errorMessage = { 
                content: 'Hubo un error al ejecutar este comando.', 
                ephemeral: true 
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
}; 