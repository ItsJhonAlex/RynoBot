import 'dotenv/config';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import logger from './utils/logger.js';
import { loadEvents } from './handlers/eventHandler.js';
import { loadCommands } from './handlers/commandHandler.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ]
});

// Colecciones para comandos y cooldowns
client.commands = new Collection();
client.cooldowns = new Collection();

// Manejadores de proceso
process.on('unhandledRejection', (error) => {
    const event = client.events.get('unhandledRejection');
    if (event) event.execute(error);
});

process.on('uncaughtException', (error) => {
    const event = client.events.get('uncaughtException');
    if (event) event.execute(error);
});

// Debug mode para desarrollo
if (process.env.NODE_ENV === 'development') {
    client.on('debug', (info) => {
        logger.debug(info);
    });
}

// Inicializar bot
const initializeBot = async () => {
    try {
        // Cargar comandos y eventos
        await loadCommands(client);
        await loadEvents(client);

        // Conectar bot
        await client.login(process.env.DISCORD_TOKEN);
        logger.info('🤖 Bot iniciado correctamente');
    } catch (error) {
        logger.error(`Error al inicializar el bot: ${error.message}`);
        process.exit(1);
    }
};

initializeBot();

