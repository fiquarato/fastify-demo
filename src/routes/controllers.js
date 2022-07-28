export default fastify => {
    const beersCollection = fastify.mongo.db.collection("beers");

    const getBeers = async (request, reply) => {
        const result = await beersCollection.find().toArray();
        if (result.length === 0) {
          reply
            .send({
              message: "Beers not found",
              error: "Not Found",
              statusCode: 404,
            })
            .code(404);
        }
        return reply.send(result).code(200);
    }

    return { getBeers };
}

