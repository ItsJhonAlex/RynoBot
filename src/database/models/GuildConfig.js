import { DataTypes } from 'sequelize';
import sequelize from '../index.js';

const GuildConfig = sequelize.define('GuildConfig', {
    guildId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    welcomeChannelId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    welcomeMessage: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    welcomeEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

export default GuildConfig; 