import logger from '../../utils/logger.js';

export default {
    name: 'unhandledRejection',
    once: false,

    execute(error) {
        logger.error('='.repeat(50));
        logger.error('⚠️ ¡Error no manejado!');
        logger.error(`💥 Error: ${error.message}`);
        logger.error(`📜 Stack: ${error.stack}`);
        logger.error('='.repeat(50));
    }
}; 