const { AmqpClient } = require('../amqp');
const { getEnv } = require('../util');
const { logger } = require('../logger');

async function bootstrap() {
	const amqp = new AmqpClient(getEnv('AMQP_URL'), 'result', 'task');

	await amqp.init();

	amqp.subscribe((id, number) => {
		setTimeout(() => {
			logger.info('Processing message', { id, number });

			const result = number * 2;
			amqp.send(result, id);

			logger.info('Message processed', { id, result });
		}, 5000);
	});

	process.once('SIGINT', async () => {
		logger.info('Shutting down');
		await amqp.destroy();
		process.exit();
	});
}

bootstrap().catch((e) => {
	logger.error('Fatal error!', { error: e });
	console.error(e);
	process.exit(1);
});
