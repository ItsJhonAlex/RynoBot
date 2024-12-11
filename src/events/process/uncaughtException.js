import logger from '../../utils/logger.js';

export default {
    name: 'uncaughtException',
    once: false,

    execute(error) {
        logger.error('='.repeat(50));
        logger.error('💥 ¡Excepción no capturada!');
        logger.error(`🔍 Error: ${error.message}`);
        logger.error(`📜 Stack: ${error.stack}`);
        logger.error('='.repeat(50));

        // En caso de excepción no capturada, es recomendable cerrar el proceso
        process.exit(1);
    }
}; 