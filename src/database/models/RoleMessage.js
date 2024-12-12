import { DataTypes } from 'sequelize';
import sequelize from '../index.js';

const RoleMessage = sequelize.define('RoleMessage', {
    messageId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    guildId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Roles Disponibles'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

export default RoleMessage; 