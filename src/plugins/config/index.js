import fastifyEnv from "@fastify/env";
import fastifyPlugin from "fastify-plugin";

export const config = fastifyPlugin((fastify, opts, next) => {
  fastify.log.info("Config plugin...");

  const schema = {
    type: "object",
    properties: {
      PORT: {
        type: "integer",
        default: 3000,
      },
    },
  };

  fastify.register(fastifyEnv, { schema, dotenv: true });

  next();
});
