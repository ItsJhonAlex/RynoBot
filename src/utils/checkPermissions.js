import { AdminUser } from '../database/models/index.js';

export async function checkPermissions(userId, requiredRole = 'MODERATOR') {
    const adminUser = await AdminUser.findOne({
        where: { userId }
    });

    if (!adminUser) return false;
    
    if (requiredRole === 'ADMIN' && adminUser.role !== 'ADMIN') return false;
    
    return true;
} 