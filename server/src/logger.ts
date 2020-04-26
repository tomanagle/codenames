import logdnaWinston from 'logdna-winston'
import winston, { format } from 'winston'
import moment from 'moment'

import { LOG_OPTIONS } from './constants'

const logger = winston.createLogger({})

const myFormat = format.printf(info => {
    return `${moment(info.timestamp).format('DD-MMM-YYYY HH:mm:ss')} ${
        info.level
    }: ${String(info.message)}`
})

logger.add(new logdnaWinston(LOG_OPTIONS))

logger.add(
    new winston.transports.Console({
        silent: false,
        level: 'info',
        format: format.combine(format.colorize(), myFormat),
    })
)

logger.add(
    new winston.transports.File({
        filename: 'combined.log',
        format: format.combine(format.colorize(), myFormat),
    })
)

// logger.add(new logdnaWinston(options))

export default logger
