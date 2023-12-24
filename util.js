/**
 * @param {string} name
 * @param {string} def
 */
const getEnv = (name, def) => {
	const ENV = process.env[name];

	if (!ENV) {
		if (def) return def;
		else throw new Error('Missing ' + name);
	}

	return ENV;
};

module.exports = { getEnv };
