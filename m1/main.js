const express = require('express');
const { AmqpClient } = require('../amqp');
const { getEnv } = require('../util');
const { logger } = require('../logger');

async function bootstrap() {
	const PORT = getEnv('PORT', 5000);
	const AMQP_URL = getEnv('AMQP_URL');

	const app = express();
	const amqp = new AmqpClient(AMQP_URL, 'task', 'result');

	await amqp.init();

	app.post('/', async (request, response) => {
		const { number } = request.query;

		if (isNaN(+number)) {
			response.status(400).send();
			return;
		}

		/** @type {number} */
		const result = await amqp.send(number).wait();

		response.json(result);
	});

	process.once('SIGINT', async () => {
		logger.info('Shutting down');
		await amqp.destroy();
		process.exit();
	});

	app.listen(PORT, () => {
		logger.info(`Server listening on port ${PORT}`);
	});
}

bootstrap().catch((e) => {
	console.error(e);
	logger.error('Fatal error!', { error: e });
	process.exit(1);
});
