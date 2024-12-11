import logger from '../../utils/logger.js';

export default {
    name: 'ready',
    once: true,
    
    async execute(client) {
        try {
            // Obtener el servidor específico
            const guild = await client.guilds.fetch(process.env.GUILD_ID);
            
            // Obtener lista de comandos registrados
            const commands = Array.from(client.commands.values());
            
            // Crear mensaje de información
            const botInfo = [
                `\n🤖 ${client.user.tag} está online!`,
                `\n📊 Estadísticas:`,
                `- Servidor principal: ${guild.name}`,
                `- Total miembros: ${guild.memberCount}`,
                `- Total comandos: ${commands.length}`,
                `\n📝 Comandos cargados:`,
                ...commands.map(cmd => `- /${cmd.data.name}: ${cmd.data.description}`)
            ].join('\n');
            
            // Mostrar información
            logger.info(botInfo);
            
        } catch (error) {
            logger.error(`Error en evento ready: ${error.message}`);
        }
    }
}; 