// @ts-ignore
import express from 'express';
import config from 'config';
import winston from 'winston';
import { merge } from 'lodash';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';

import configExpress from '@/startup/configExpress';
import logging from '@/startup/logging';
import { dbConnect } from '@/startup/dbConnect';
import prod from '@/startup/prod';
import routes from '@/startup/routes';
import { resolvers as gameResolvers } from './graphql/game.resolvers';
import { resolvers as frameResolvers } from './graphql/frame.resolvers';
import { typeDefs as GameDefs } from './graphql/game.typeDefs';
import { typeDefs as FrameDefs } from './graphql/frame.typeDefs';

const app = express();
const httpServer = http.createServer(app);

// Set up Apollo Server
const apolloServer = new ApolloServer({
    typeDefs: [GameDefs, FrameDefs],
    resolvers: merge(gameResolvers, frameResolvers),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

async function startApolloServer() {
    await apolloServer.start();

    configExpress(app);
    logging(app);
    if (app.get('env') === 'production') {
        prod(app);
    }
    // validation();
    routes(app);

    app.use(expressMiddleware(apolloServer));

    const port = config.get<number>('PORT');

    const server = httpServer.listen({ port: port }, () =>
        winston.info(`🚀 Server ready at http://localhost:${port}...`)
    );
}

startApolloServer();

dbConnect(config.get<string>('MONGODB_NAME_DATA'));

// export default server;
