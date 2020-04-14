"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_express_2 = require("apollo-server-express");
exports.pubsub = new apollo_server_express_2.PubSub();
const connect_1 = __importDefault(require("./database/connect"));
const method_override_1 = __importDefault(require("method-override"));
const resolvers_1 = __importDefault(require("./resolvers"));
const schema_1 = __importDefault(require("./schema"));
const cors_1 = __importDefault(require("cors"));
const port = 4000;
const ApolloServer = new apollo_server_express_1.ApolloServer({
    typeDefs: schema_1.default,
    resolvers: resolvers_1.default,
    /*
     * GraphQL errors can be formatted into any shape you want. Available fields are on GraphQLError
     */
    formatError: (error) => {
        // eslint-disable-next-line
        console.log(error);
        return error;
    },
});
const app = express_1.default();
const debug = require('debug')('apily:server');
app.use(cors_1.default({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(method_override_1.default());
app.use(cookie_parser_1.default());
app.set('port', port);
const server = http_1.default.createServer(app);
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
    debug('Listening on ' + bind);
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            process.exit(1);
            break;
        case 'EADDRINUSE':
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/*
 * Respond to OPTIONS requests with a 200
 */
// app.use('/graphql', (req: Request, res: Response, next: NextFunction) => {
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200)
//     }
//     return next()
// })
connect_1.default({ db: 'mongodb://localhost/test-database' });
ApolloServer.applyMiddleware({ app, cors: false });
ApolloServer.installSubscriptionHandlers(server);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
//# sourceMappingURL=app.js.map