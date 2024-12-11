import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';
import { Collection } from 'discord.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadEvents(client) {
    client.events = new Collection();
    const eventsPath = join(__dirname, '../events');
    const eventFolders = readdirSync(eventsPath);

    for (const folder of eventFolders) {
        const eventFiles = readdirSync(join(eventsPath, folder))
            .filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = join(eventsPath, folder, file);
            const event = await import(`file://${filePath}`);

            client.events.set(event.default.name, event.default);

            if (folder === 'process') {
                process.on(event.default.name, (...args) => 
                    event.default.execute(...args));
            } else {
                if (event.default.once) {
                    client.once(event.default.name, (...args) => 
                        event.default.execute(...args, client));
                } else {
                    client.on(event.default.name, (...args) => 
                        event.default.execute(...args, client));
                }
            }

            logger.info(`📂 Evento cargado: ${event.default.name}`);
        }
    }
} 