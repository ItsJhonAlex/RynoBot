import { DataTypes } from 'sequelize';
import sequelize from '../index.js';

const AdminUser = sequelize.define('AdminUser', {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'MODERATOR'),
        allowNull: false,
        defaultValue: 'MODERATOR'
    },
    addedBy: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

export default AdminUser; 