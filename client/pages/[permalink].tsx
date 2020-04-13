import React, { useState, useEffect } from 'react';
import { Radio, Button, Input } from 'antd';
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

const GamePage = ({ query: { permalink } }) => {
  const [name, setName] = useState('');
  // @ts-ignore
  const [team, setTeam] = useState<Team>('');
  // @ts-ignore
  const [role, setRole] = useState<Role>('');
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

  const [joinGame, { error }] = useJoinGameMutation({
    onCompleted: data => {
      setUser(data.JoinGame);
      localStorage.setItem(
        `${permalink}codenamesuser`,
        JSON.stringify(data.JoinGame)
      );
    },
    variables: {
      input: {
        permalink,
        name,
        role,
        team
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
  const users: Game['users'] = get(data, 'game.users', []);

  const redSpymaster = users.filter(
    u => u.role === Role.SPYMASTER && u.team === Team.RED
  )[0];
  const greenSpymaster = users.filter(
    u => u.role === Role.SPYMASTER && u.team === Team.GREEN
  )[0];
  const redPlayer = users.filter(
    u => u.role === Role.PLAYER && u.team === Team.RED
  )[0];

  const greenPlayer = users.filter(
    u => u.role === Role.PLAYER && u.team === Team.GREEN
  )[0];

  return (
    <App title="Codenames" description="Play codenames online with friends">
      Error: {JSON.stringify(error)}
      <br />
      user: {JSON.stringify(user)}
      <br />
      players: {JSON.stringify(users)}
      {user ? (
        <GameContainer permalink={permalink} user={user} game={game} />
      ) : (
        <>
          <Input
            onChange={e => setName(e.target.value)}
            value={name}
            placeholder="Choose a name"
          />
          <h3>Team</h3>
          <Radio.Group
            onChange={e => {
              setTeam(e.target.value);
            }}
            value={team}
          >
            <Radio value={Team.RED}>{Team.RED.toLocaleUpperCase()}</Radio>
            <Radio value={Team.GREEN}>{Team.GREEN.toLocaleUpperCase()}</Radio>
          </Radio.Group>
          <h3>Role</h3>
          <Radio.Group
            onChange={e => {
              setRole(e.target.value);
            }}
            value={role}
          >
            <Radio value={Role.PLAYER}>{Role.PLAYER.toLocaleUpperCase()}</Radio>
            <Radio value={Role.SPYMASTER}>
              {Role.SPYMASTER.toLocaleUpperCase()}
            </Radio>
          </Radio.Group>
          <Button
            type="primary"
            disabled={!role || !team || !name}
            onClick={() => joinGame()}
          >
            JOIN GAME
          </Button>
        </>
      )}
    </App>
  );
};

export default GamePage;
