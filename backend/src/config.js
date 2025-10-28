let dotenvLoaded = false;
try {
  // Lazy-load dotenv so we don't hard fail if it's not installed yet.
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const dotenv = require('dotenv');
  if (typeof dotenv.config === 'function') {
    dotenv.config();
    dotenvLoaded = true;
  }
} catch (error) {
  // Running without dotenv is acceptable when environment variables are already present.
  console.warn('dotenv not available, continuing without .env support.');
}

const provider = (process.env.AI_PROVIDER || '').toLowerCase();

const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  baseUrl: process.env.OPENAI_BASE_URL || '',
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  temperature: process.env.OPENAI_TEMPERATURE
    ? Number.parseFloat(process.env.OPENAI_TEMPERATURE)
    : undefined,
  maxTokens: process.env.OPENAI_MAX_TOKENS
    ? Number.parseInt(process.env.OPENAI_MAX_TOKENS, 10)
    : undefined,
};

const aiConfig = {
  provider,
  openai: openaiConfig,
  enabled: Boolean(
    provider
      && (
        (provider === 'openai' && openaiConfig.apiKey)
      ),
  ),
  dotenvLoaded,
};

module.exports = {
  aiConfig,
};
