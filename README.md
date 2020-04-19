<div align="center">

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) 
[![GitHub issues](https://img.shields.io/github/issues/tomanagle/codenames?style=flat-square)](https://github.com/tomanagle/codenames/issues)[![GitHub stars](https://img.shields.io/github/stars/tomanagle/codenames?style=flat-square)](https://github.com/tomanagle/codenames/stargazers)

Built with 💜 by [Tom Nagle](https://github.com/tomanagle)

🌟 👀 ⚡ 💥
</div>

## Contributing ✅
Contributions are welcome! Before working on a PR, raise an issue so we can talk about your feature and make sure it will be merged into master.

Help wanted with:
* Increasing client test coverage
* Increasing server test coverage
* Translating from English to other languages so everyone can play :)


## Introduction 😊
A fullstack JavaScript application that emulates the popular board game Codenames.The application takes advantage of WebSockets to keep all participants in a game in sync, instead of intermittent polling.

The server provides a [GraphQL API](https://www.apollographql.com/docs/apollo-server/), thanks to Apollo Server. The client consumes the GraphQL API thanks to [Apollo Client](https://www.apollographql.com/docs/react/).


---


## Getting started 😁

1. Clone the repository
2. yarn install the required modules in both the client and server
3. run the client with ```yarn dev```
4. run the server with ```yarn dev```, or ```docker-compose up``` or ```./build.sh```
5. touch ./server/.env
6. touch ./client/.env

Note: The ./build.sh script will need to be made executable with ```chod +x ./build.sh``` before you can execute it.

**./server.env**
```
MONO_DB_CONNECTION_STRING=MongodDB connection string, either Cloud Atlas or localhost

CORS_ORIGIN=From what domain will the request be coming from, e.g. http://localhost:3000
```

**./client/.env**
```
SERVER_BASE_URL=Full path to GraphQL server, e.g. http://localhost:4000/graphql
WEBSOCKET_BASE_URL=Full path to WebSocket server, e.g. ws://localhost:4000/graphql (wss for websocket secure)
SENTRY_DSN=Sentry DNS if you want to log errors in Sentry (you should)

```
---

## Technologies 🚀

### Client
* Next.js 
* React.js
* Apollo client (GraphQL)
* TypeScript

### Server
* MongoDB
* Mongoose
* Node.js
* Apollo server (GraphQL)
* TypeScript
* Express
* Docker

---

## Game flow 🎲
**Start game**

Creates a game object with a new set of 25 words and redirects the user to the game. The game won't start or show the board until all 4 users have joined.

**Join game**
When the user starts the game, or lands on a game page that has less than 4 users, they will be promoted to join the game. The user will enter a name, choose a team and choose a role.

**Pick word**
If the user's role is 'Player' they will need to choose a the words that relate to the Spymaster's one word clue.

If the user selects the death word, the game will end and the opposite team will be the winners.

If the user selects the opposing team's word, the word will be marked as picked and the turn will switch to the opposing team.

If the user selects a word that belongs to no team, the word will be removed from the board and the turn will switch to the opposing team. 

**End turn**

The team that holds game play can choose to end their turn and move it on to the opposing team.

**Reset game**

When a game finishes, it can be reset. All players, the winner and current turn will be removed. The user's will have to rejoin with their new desired team and role.

