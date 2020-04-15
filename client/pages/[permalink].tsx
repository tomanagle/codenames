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
import Loading from '../containers/Loading';

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

  const game: Game = get(data, 'game');
  const users: Game['users'] = get(data, 'game.users', []);
  const readyUsers: Game['users'] = users.filter(
    item => item.role && item.team
  );

  useEffect(() => {
    if (users && user) {
      const thisUser = users.filter(item => item._id === user._id)[0];
      setUser(thisUser);

      localStorage.setItem(
        `${permalink}codenamesuser`,
        JSON.stringify(thisUser)
      );
    }
  }, [users]);

  if (loading) {
    return <Loading />;
  }

  if (!game) {
    return <Error statusCode={404} />;
  }

  return (
    <App
      title="Codenames"
      description="Play codenames online with friends"
      showFooter={false}
    >
      {game.winner ? (
        <Winner
          winner={game.winner}
          players={users.filter(item => item.team === game.winner)}
        />
      ) : null}
      {(!user || !user.role || !user.team) && readyUsers.length !== 4 && (
        <JoinGame
          users={users}
          permalink={permalink}
          setUser={setUser}
          visible={!user || !user.role || !user.team}
        />
      )}
      {readyUsers.length === 4 ? (
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
            readyUsers.length === 1 ? '' : 's'
          } in the room. We need 4 to start.`}
        />
      )}
    </App>
  );
};

export default GamePage;
