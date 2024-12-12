import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar la conexión a la base de datos
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../data/database.sqlite'),
    logging: msg => logger.debug(msg)
});

// Probar la conexión
try {
    await sequelize.authenticate();
    logger.info('✅ Conexión a la base de datos establecida correctamente.');
} catch (error) {
    logger.error('❌ Error conectando a la base de datos:', error);
}

export default sequelize; 