import http from 'http'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import { NextFunction } from 'connect'
import { GraphQLError } from 'graphql'
import { ApolloServer as _ApolloServer } from 'apollo-server-express'
import { PubSub } from 'apollo-server-express'
import { CORS_ORIGIN, IS_DEBUG } from './constants'
import connect from './database/connect'
import methodOverride from 'method-override'
import resolvers from './resolvers'
import typeDefs from './schema'
import cors from 'cors'
import insert from './migration/insert'
import { version } from '../package.json'

const port = 4000
export const pubsub = new PubSub()

const ApolloServer = new _ApolloServer({
    typeDefs,
    resolvers,
    playground: IS_DEBUG,
    tracing: IS_DEBUG,
    /*
     * GraphQL errors can be formatted into any shape you want. Available fields are on GraphQLError
     */
    formatError: (error: GraphQLError) => {
        // eslint-disable-next-line
        console.log(error)
        return error
    },
})

const app = express()

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
    await connect()

    setTimeout(async () => {
        await insert({ drop: true }).then(data => {
            console.log('Finished inserting words :)')
        })
    }, 2000)

    const addr = server.address()

    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port
    debug('Listening on ' + bind)
}

/* ===============================================
Event listener for HTTP server "error" event.
=============================================== */

interface IError extends Error {
    syscall: string
    code: string
}

function onError(error: IError) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            process.exit(1)
            break
        case 'EADDRINUSE':
            process.exit(1)
            break
        default:
            throw error
    }
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

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
