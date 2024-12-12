import AdminUser from './AdminUser.js';
import GuildConfig from './GuildConfig.js';
import sequelize from '../index.js';
import logger from '../../utils/logger.js';

// Sincronizar modelos con la base de datos
const initDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        logger.info('✅ Modelos sincronizados correctamente');
    } catch (error) {
        logger.error('❌ Error sincronizando modelos:', error);
    }
};

export {
    AdminUser,
    GuildConfig,
    initDatabase
}; 