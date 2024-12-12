import { DataTypes } from 'sequelize';
import sequelize from '../index.js';

const ReactionRole = sequelize.define('ReactionRole', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    messageId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roleId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emoji: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isExclusive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    maxUsers: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true
});

export default ReactionRole; 