import { Router, Request, Response } from 'express';
import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    return res.send('Hello from graphql!');
});

export default router;

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
    hello: () => {
        return 'Hello world!';
    },
};

router.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);
