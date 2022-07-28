import Fastify from 'fastify';
import { config } from './src/plugins/config/index.js';
import { mongo } from './src/plugins/mongo/index.js';
import { cache } from './src/plugins/cache/index.js';
import { routes } from './src/routes/index.js';
import swagger from '@fastify/swagger';

const fastify = Fastify({
  logger: true,
});

fastify.register(config);
fastify.register(mongo);
fastify.register(swagger, {
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0'
    }
  }
});
fastify.register(cache);
fastify.register(routes);

const start = async () => {
  try {
    await fastify.ready();
    await fastify.listen({port: fastify.config.PORT});
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
