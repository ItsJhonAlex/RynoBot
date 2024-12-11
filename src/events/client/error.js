import logger from '../../utils/logger.js';

export default {
    name: 'error',
    once: false,

    execute(error) {
        logger.error(`Error del cliente Discord: ${error.message}`);
    }
}; 