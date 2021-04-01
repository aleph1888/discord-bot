/**
 * This file holds the main logger. Please avoid using console.log.
 * 
 * How to use:
 * 
 * 	L = new Logger();
 * 	this.L.logger.info("Starting main bot...");
 */
import {createLogger, format, transports} from 'winston'
const { combine, timestamp, label, prettyPrint } = format;
export class Logger{
    public logger = createLogger({
        level: 'debug',
        format: format.simple(),
        transports: [

			// - Write to all logs with level `info` and above to `combined.log`
			// new transports.File({ filename: 'combined.log'}),
			// - Write all logs error (and above) to Console/terminal
			new transports.Console()

        ]
    });
}