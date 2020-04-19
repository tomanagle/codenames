import { get } from 'lodash'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import * as Sentry from '@sentry/node'

const apolloServerSentryPlugin = {
    requestDidStart() {
        return {
            didEncounterErrors(rc) {
                Sentry.withScope(scope => {
                    scope.addEventProcessor(event =>
                        Sentry.Handlers.parseRequest(event, rc.context.req)
                    )

                    scope.setTags({
                        graphql: get(rc, 'operation.operation', 'parse_err'),
                        graphqlName: get(
                            rc,
                            'operationName',
                            rc.request.operationName
                        ),
                    })

                    rc.errors.forEach(error => {
                        if (error.path || error.name !== 'GraphQLError') {
                            scope.setExtras({
                                path: error.path,
                            })
                            Sentry.captureException(error)
                        } else {
                            scope.setExtras({})
                            Sentry.captureMessage(
                                `GraphQLWrongQuery: ${error.message}`
                            )
                        }
                    })
                })
            },
        }
    },
} as ApolloServerPlugin

export default apolloServerSentryPlugin
