import controller from "./controllers.js";

export const routes = async (fastify, options) => {
  const beersCollection = fastify.mongo.db.collection("beers");

  const { getBeers } = controller(fastify);

  const beerSchema = {
    brand: {
      type: "string",
      minLength: 1,
      maxLength: 20,
    },
    type: {
      type: "string",
      minLength: 1,
      maxLength: 20,
    },
    sku: {
      type: "string",
      minLength: 1,
      maxLength: 20,
    },
  };

  const getBeersSchema = {
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: beerSchema,
        },
      },
    },
  };

  const postBeersSchema = {
    body: {
      type: 'object',
      properties: beerSchema,
      required: ['sku', 'type', 'brand']
    },
  };

  fastify.get("/beers", { schema: getBeersSchema }, getBeers);

  fastify.get("/beers/:sku", async (request, reply) => {
    const { sku } = request.params;
    const result = await beersCollection.findOne({ sku });
    if (result) {
      return reply.send(result).code(200);
    }
    reply
      .send({
        message: "Beers not found",
        error: "Not Found",
        statusCode: 404,
      })
      .code(404);
  });

  fastify.delete("/beers/:sku", async (request, reply) => {
    const { sku } = request.params;
    const result = await beersCollection.deleteOne({ sku });
    if (result.deletedCount === 1) {
      return reply.send(result).code(200);
    }
    reply
      .send({
        message: "Beers not found",
        error: "Not Found",
        statusCode: 404,
      })
      .code(404);
  });

  fastify.post(
    "/beers",
    { schema: postBeersSchema },
    async (request, reply) => {
      const body = request.body;
      const result = await beersCollection.insertOne(body);
      if (result.acknowledged) return reply.code(201).send();
      reply
        .send({
          message: "Beer not added",
          error: "Beer insert error",
          statusCode: 400,
        })
        .code(400);
    }
  );
};
