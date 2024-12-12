import AdminUser from './AdminUser.js';
import GuildConfig from './GuildConfig.js';
import RoleMessage from './RoleMessage.js';
import ReactionRole from './ReactionRole.js';
import sequelize from '../index.js';
import logger from '../../utils/logger.js';

// Definir relaciones
RoleMessage.hasMany(ReactionRole, {
    foreignKey: 'messageId',
    sourceKey: 'messageId',
    onDelete: 'CASCADE'
});

ReactionRole.belongsTo(RoleMessage, {
    foreignKey: 'messageId',
    targetKey: 'messageId'
});

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
    RoleMessage,
    ReactionRole,
    initDatabase
}; 