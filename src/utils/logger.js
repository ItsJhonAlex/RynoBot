import winston from 'winston';
import chalk from 'chalk';

// Configuracion de colores personalizados
const logColors = {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green'
}

// Formato personalizado para los logs
const logFormat = winston.format.printf(({level, message, timestamp}) => {
    const color = logColors[level] || 'white';
    const prefix = {
        error: '❌ ERROR',
        warn: '⚠️ WARN',
        info: 'ℹ️ INFO',
        debug: '🐛 DEBUG'
    }
    return `${chalk.gray(timestamp)} ${chalk[color](prefix[level])} ${message}`;
})

// Crear el logger
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // Consola
        new winston.transports.Console(),
        // Archivo para todos los logs
        new winston.transports.File({
            filename: 'logs/bot.log'
        }),
        // Archivo específico para errores
        new winston.transports.File({
            filename: 'logs/errors.log',
            level: 'error'
        }),
        // Archivo para debug
        new winston.transports.File({
            filename: 'logs/debug.log',
            level: 'debug'
        })
    ]
})

export default logger;
