import * as React from 'react';
import { Result, Input, Button, message } from 'antd';
import Error from 'next/error';
import { get } from 'lodash';
import styled from 'styled-components';
import * as Sentry from '@sentry/node';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import App from '../components/App';
import {
  useGameQuery,
  useGameUpdatedSubscription,
  useGameResetSubscription,
  Team,
  Game
} from '../generated';
import GameContainer from '../containers/Game';
import JoinGame from '../containers/JoinGame';
import Winner from '../containers/Winner';
import Loading from '../containers/Loading';

const WaitingWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  flex-direction: column;
`;

const CopyWrapper = styled.div`
  display: flex;
`;

const GamePage = ({ query: { permalink } }) => {
  const [user, setUser] = React.useState(null);

  Sentry.configureScope(scope => {
    // Set if this is an SSR error or not
    scope.setTag('game', permalink);
  });

  React.useEffect(() => {
    const addThisWrapper = document.getElementById('at4-share');
    if (addThisWrapper) {
      addThisWrapper.style.display = 'none';
    }
  }, []);

  React.useEffect(() => {
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

  useGameResetSubscription({
    onSubscriptionData: () => {
      setUser(null);
    },

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

  React.useEffect(() => {
    if (users && user) {
      const thisUser = users.filter(item => item._id === user._id)[0];

      if (thisUser) {
        setUser(thisUser);

        localStorage.setItem(
          `${permalink}codenamesuser`,
          JSON.stringify(thisUser)
        );
      }
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
      {game.winner && game.winner !== Team.NONE ? (
        <>
          <Winner
            winner={game.winner}
            players={users.filter(item => item.team === game.winner)}
            permalink={permalink}
          />
        </>
      ) : null}

      {(!user || !user.role || !user.team) && readyUsers.length !== 4 && (
        <JoinGame
          users={users}
          permalink={permalink}
          setUser={setUser}
          visible={!user || !user.role || !user.team}
        />
      )}

      <GameContainer
        readyUsersLength={readyUsers.length}
        permalink={permalink}
        user={
          user || {
            team: Team.NONE
          }
        }
        game={game}
      />
    </App>
  );
};

export default GamePage;
