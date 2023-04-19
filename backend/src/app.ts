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
import prod from '@/startup/deploy';
import routes from '@/startup/routes';
import { resolvers as gameResolvers } from '@/graphql/game.resolvers';
import { resolvers as frameResolvers } from '@/graphql/frame.resolvers';
import { resolvers as eventResolvers } from '@/graphql/event.resolvers';
import { resolvers as liveFeedResolvers } from '@/graphql/liveFeed.resolvers';
import { typeDefs as GameDefs } from '@/graphql/game.typeDefs';
import { typeDefs as FrameDefs } from '@/graphql/frame.typeDefs';
import { typeDefs as EventDefs } from '@/graphql/event.typeDefs';
import { typeDefs as liveFeedDefs } from '@/graphql/liveFeed.typeDefs';
import morgan from 'morgan';

logging();

winston.info('Starting up...');

const app = express();
const httpServer = http.createServer(app);

const apolloServer = new ApolloServer({
    typeDefs: [GameDefs, FrameDefs, EventDefs, liveFeedDefs],
    resolvers: merge(gameResolvers, frameResolvers, eventResolvers, liveFeedResolvers),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

startServer();

async function startServer() {
    await dbConnect(config.get<string>('MONGODB_NAME_DATA'));
    await apolloServer.start();

    configExpress(app);

    winston.info(`Environment: ${app.get('env')}`);
    if (app.get('env') === 'development') {
        app.use(morgan('tiny'));
    }
    if (app.get('env') === 'production') {
        prod(app);
    }
    // validation();
    routes(app);

    app.use(expressMiddleware(apolloServer));

    const port = config.get<number>('PORT');

    // todo figure out if I need to specify 0.0.0.0 in the productino or can I just remove this altogether
    httpServer.listen({ port }, () => {
        winston.info(`🚀 Server ready at http://localhost:${port}...`);
    });
}
