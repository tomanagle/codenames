import React, { useState, useEffect } from 'react';
import { Result, Input, Button, message, Form } from 'antd';
import Error from 'next/error';
import { get } from 'lodash';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import App from '../components/App';
import {
  useGameQuery,
  useGameUpdatedSubscription,
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
      {game.winner ? (
        <Winner
          winner={game.winner}
          players={users.filter(item => item.team === game.winner)}
          permalink={permalink}
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
      {readyUsers.length === 4 || true ? (
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
        <WaitingWrapper>
          <Result
            title={`Not enough players to start`}
            subTitle={`We currently have ${users.length} player${
              readyUsers.length === 1 ? '' : 's'
            } in the room. We need 4 to start.`}
          />
          <p>
            To play with friends they will need to join the same game. Copy the
            link below and share it with your friends.
          </p>

          <CopyWrapper>
            <Input
              value={`https://playcodenames.online/${permalink}`}
              id="game-url"
            />
            <CopyToClipboard
              text={`https://playcodenames.online/${permalink}`}
              onCopy={() =>
                message.success(
                  'Copied to clipboard. Now share it with your friends!',
                  30
                )
              }
            >
              <Button>Copy to clipboard</Button>
            </CopyToClipboard>
          </CopyWrapper>
        </WaitingWrapper>
      )}
    </App>
  );
};

export default GamePage;
