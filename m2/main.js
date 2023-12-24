const { AmqpClient } = require('../amqp');
const { getEnv } = require('../util');

async function bootstrap() {
	const amqp = new AmqpClient(getEnv('AMQP_URL'), 'result', 'task');

	await amqp.init();

	amqp.subscribe((id, content) => {
		setTimeout(() => {
			amqp.send(content * 2, id);
		}, 5000);
	});

	process.once('SIGINT', async () => {
		await amqp.destroy();
		process.exit();
	});
}

bootstrap().catch((e) => {
	console.error(e);
	process.exit(1);
});
