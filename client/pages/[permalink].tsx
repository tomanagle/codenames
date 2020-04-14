import React, { useState, useEffect } from 'react';
import { Result } from 'antd';
import Error from 'next/error';
import { get } from 'lodash';
import App from '../components/App';
import {
  useGameQuery,
  useGameUpdatedSubscription,
  useJoinGameMutation,
  Role,
  Team,
  Game
} from '../generated';
import GameContainer from '../containers/Game';
import JoinGame from '../containers/JoinGame';
import Winner from '../containers/Winner';

const GamePage = ({ query: { permalink } }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem(`${permalink}codenamesuser`);
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const { data, loading } = useGameQuery({
    variables: {
      input: {
        permalink
      }
    }
  });

  useGameUpdatedSubscription({
    variables: {
      input: {
        permalink
      }
    }
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  const game: Game = get(data, 'game');

  if (!game) {
    return <Error statusCode={404} />;
  }

  const users: Game['users'] = get(data, 'game.users', []);

  return (
    <App title="Codenames" description="Play codenames online with friends">
      {game.winner ? (
        <Winner
          winner={game.winner}
          players={users.filter(item => item.team === game.winner)}
        />
      ) : null}
      {!user && users.length !== 4 && (
        <JoinGame
          users={users}
          permalink={permalink}
          setUser={setUser}
          visible={!user}
        />
      )}
      {users.length === 4 || true ? (
        <GameContainer
          permalink={permalink}
          user={
            user || {
              team: Team.NONE
            }
          }
          game={game}
        />
      ) : (
        <Result
          title={`Not enough players to start`}
          subTitle={`We currently have ${users.length} player${
            users.length === 1 ? '' : 's'
          } in the room. We need 4 to start.`}
        />
      )}
    </App>
  );
};

export default GamePage;
