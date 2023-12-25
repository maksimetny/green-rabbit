const path = require('node:path');
const winston = require('winston');

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: path.join('logs', `${process.env.SERVICE || 'logs'}.log`) }),
	],
});

module.exports = { logger };
