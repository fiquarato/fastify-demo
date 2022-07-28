import fastifyPlugin from "fastify-plugin";
import NodeCache from 'node-cache';

export const cache = fastifyPlugin((fastify, opts, done) => {
  fastify.log.info("Cache plugin...");

  const cache = new NodeCache();
  const CACHE_TTL = 20;

  fastify.addHook('onRequest', async (request, reply) => {
    if("GET" === request.method) {
      const response = cache.get(request.url);
      if(response != undefined) {
        fastify.log.info(`RETURNING FROM CACHE FOR KEY = ${request.url}`);
        reply
          .code(200)
          .header('Content-Type', 'application/json')
          .send(response);
      }
    }
  });

  fastify.addHook('onSend', (request, reply, payload, done) => {
    if("GET" === request.method) {
      const response = cache.get(request.url);
      if(response == undefined) {
        fastify.log.info(`CACHING RESPONSE FOR KEY = ${request.url}`);
        cache.set(request.url, payload, CACHE_TTL);
      }
    }
    done();
  });
  done();
});
