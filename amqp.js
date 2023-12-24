const { EventEmitter } = require('node:events');
const amqp = require('amqplib');
const crypto = require('crypto');

/**
 * @template I
 * @template O
 */
class AmqpClient {
	/** @type {string} */
	#url;

	/** @type {amqp.Connection} */
	#connection;

	/** @type {amqp.Channel} */
	#channel;

	/** @type {EventEmitter} */
	#eventEmitter;

	/** @type {string} */
	#inputQueue;

	/** @type {string} */
	#outputQueue;

	/**
	 * @param {string} amqpUrl
	 * @param {string} outputQueue
	 * @param {string} inputQueue
	 */
	constructor(amqpUrl, outputQueue, inputQueue) {
		this.#url = amqpUrl;
		this.#eventEmitter = new EventEmitter();
		this.#outputQueue = outputQueue;
		this.#inputQueue = inputQueue;
	}

	async init() {
		this.#connection = await amqp.connect(this.#url);
		this.#channel = await this.#connection.createChannel();

		await this.#channel.assertQueue(this.#outputQueue);
		await this.#channel.assertQueue(this.#inputQueue);

		await this.#channel.consume(this.#inputQueue, (message) => {
			if (!message) return; // TODO: throw error

			const id = message.properties.correlationId;
			const content = JSON.parse(message.content.toString());

			this.#eventEmitter.emit(
				this.#inputQueue,
				id,
				content,
			);
			this.#eventEmitter.emit(
				message.properties.correlationId,
				content,
			);
			this.#channel.ack(message);
		});
	}

	/** @param {(correlationId: string, content: I) => void} callback */
	subscribe(callback) {
		this.#eventEmitter.on(this.#inputQueue, callback);
	}

	// TODO: unsubscribe

	/**
	 * @param {O} content
	 * @param {string} correlationId
	 */
	send(content, correlationId = crypto.randomUUID()) {
		this.#channel.sendToQueue(
			this.#outputQueue,
			Buffer.from(JSON.stringify(content)),
			{ correlationId },
		);

		return {
			/** @return {Promise<I>} */
			wait: () => new Promise((resolve) => this.#eventEmitter.once(correlationId, resolve)),
			// TODO: unsubscribe
		};
	}

	async destroy() {
		await this.#channel.close();
		await this.#connection.close();

		// TODO: remove listeners
	}
}

module.exports = { AmqpClient };
