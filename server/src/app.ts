import http from 'http'
import { get } from 'lodash'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import { NextFunction } from 'connect'
import { GraphQLError } from 'graphql'
import { ApolloServer as _ApolloServer } from 'apollo-server-express'
import { PubSub } from 'apollo-server-express'
import * as Sentry from '@sentry/node'
import { CORS_ORIGIN, IS_DEBUG, SENTRY_DSN, ENV } from './constants'
import connect from './database/connect'
import methodOverride from 'method-override'
import resolvers, { rateLimitDirective } from './resolvers'
import typeDefs from './schema'
import cors from 'cors'
import insert from './migration/insert'
import { version, name } from '../package.json'
import apolloServerSentryPlugin from './utils/apolloServerSentryPlugin'
import Logger from './logger'

const port = 4000
export const pubsub = new PubSub()

const app = express()

Sentry.init({
    environment: ENV,
    release: `${name}-${version}`,
    dsn: SENTRY_DSN,
})

const ApolloServer = new _ApolloServer({
    schemaDirectives: {
        rateLimit: rateLimitDirective,
    },
    typeDefs,
    resolvers,
    playground: IS_DEBUG,
    tracing: IS_DEBUG,
    plugins: [apolloServerSentryPlugin],
    /*
     * GraphQL errors can be formatted into any shape you want. Available fields are on GraphQLError
     */
    formatError: (error: GraphQLError) => {
        // eslint-disable-next-line
        Logger.error(`GraphQL Error message: ${error.message}`)
        Logger.error(
            `GraphQL Error stacktrace: ${error.extensions.exception.stacktrace}`
        )
        return error
    },
    context: ({ req, ...rest }) => {
        const ip = get(
            req,
            "headers['x-forwarded-for']",
            get(req, 'connection.remoteAddress', 'UNKNOWN')
        )

        return { ...req, ...rest, ip }
    },
})

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler())

const debug = require('debug')('codenames:server')

app.use(
    cors({
        origin: CORS_ORIGIN,
        credentials: true,
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride())
app.use(cookieParser())

app.set('port', port)

app.get('/healthcheck', (req, res) =>
    res.send(`Server is healthy and running ${version}`)
)

const server = http.createServer(app)

async function onListening() {
    Logger.info(`Server started on port ${port}`)
    await connect()

    setTimeout(async () => {
        await insert({ drop: true }).then(() => {
            return true
        })
    }, 2000)

    const addr = server.address()

    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port
    debug('Listening on ' + bind)
}

/*
 * Respond to OPTIONS requests with a 200
 */
app.use('/graphql', (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    return next()
})

ApolloServer.applyMiddleware({ app, cors: false })

ApolloServer.installSubscriptionHandlers(server)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

server.listen(port)
server.on('listening', onListening)
