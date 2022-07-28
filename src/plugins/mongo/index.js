import fastifyMongo from "@fastify/mongodb";
import fastifyEnv from "@fastify/env";
import fastifyPlugin from "fastify-plugin";

export const mongo = fastifyPlugin((fastify, opts, next) => {
  fastify.log.info("Mongo plugin...");

  const schema = {
    type: "object",
    properties: {
      MONGO_URL: {
        type: "string",
      },
    },
  };

  fastify.register(fastifyEnv, {
    confKey: "mongoConfig",
    schema,
    dotenv: true,
  });
  fastify.register(
    fastifyPlugin((fastify, opts, done) => {
      fastify.register(fastifyMongo, {
        url: fastify.mongoConfig.MONGO_URL,
      });
      done();
    })
  );

  next();
});
