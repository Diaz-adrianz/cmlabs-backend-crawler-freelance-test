import http from 'http';

import app from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger/logger.js';
import { getArg } from './utils/misc.js';
import Browser from './lib/browser/browser.js';

const server = http.createServer(app);
const browser = Browser.getInstance();

// args
const concurrency = getArg('concurrency', '3');

// pre-process on startup
async function startup() {
  try {
    await browser.launch();
    browser.setMaxConcurrency(+concurrency);
    console.log(`🚀 Browser launched with ${concurrency} concurrencies `);

    server.listen(env.PORT, () => {
      logger.info(`[${env.APP_NAME}] API running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

// post-process before terminated
async function shutdown() {
  console.log('\n🛑 Shutting down...');
  await browser.close();
  process.exit(0);
}

// init
startup();

// terminator
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
