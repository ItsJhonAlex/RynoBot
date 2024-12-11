import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client) {
    const commands = [];
    const commandsPath = join(__dirname, '../commands');
    const commandFolders = readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const commandFiles = readdirSync(join(commandsPath, folder))
            .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = join(commandsPath, folder, file);
            const command = await import(`file://${filePath}`);

            if ('data' in command.default && 'execute' in command.default) {
                client.commands.set(command.default.data.name, command.default);
                commands.push(command.default.data.toJSON());
                logger.info(`📂 Comando cargado: ${command.default.data.name}`);
            } else {
                logger.warn(`⚠️ Comando ${file} no tiene las propiedades requeridas`);
            }
        }
    }

    // Registrar comandos con Discord API
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    try {
        logger.info('🔄 Actualizando comandos (/)...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        logger.info('✅ Comandos actualizados exitosamente');
    } catch (error) {
        logger.error(`❌ Error al actualizar comandos: ${error.message}`);
    }
} 