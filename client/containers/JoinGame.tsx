import React, { useState, useEffect } from 'react';
import { Radio, Button, Input, Modal, Form, List, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useJoinGameMutation, Role, Team, Game } from '../generated';

const JoinGame = ({ permalink, setUser, visible, users }) => {
  let availableRoles = [];

  const [name, setName] = useState('');
  // @ts-ignore
  const [team, setTeam] = useState<Team>('');
  // @ts-ignore
  const [role, setRole] = useState<Role>('');

  const redSpymaster = users.filter(
    u => u.role === Role.SPYMASTER && u.team === Team.RED
  )[0];
  if (!redSpymaster) {
    availableRoles = [
      ...availableRoles,
      {
        role: Role.SPYMASTER,
        team: Team.RED
      }
    ];
  }

  const greenSpymaster = users.filter(
    u => u.role === Role.SPYMASTER && u.team === Team.GREEN
  )[0];

  if (!greenSpymaster) {
    availableRoles = [
      ...availableRoles,
      {
        role: Role.SPYMASTER,
        team: Team.GREEN
      }
    ];
  }

  const redPlayer = users.filter(
    u => u.role === Role.PLAYER && u.team === Team.RED
  )[0];
  if (!redPlayer) {
    availableRoles = [
      ...availableRoles,
      {
        role: Role.PLAYER,
        team: Team.RED
      }
    ];
  }

  const greenPlayer = users.filter(
    u => u.role === Role.PLAYER && u.team === Team.GREEN
  )[0];

  if (!greenPlayer) {
    availableRoles = [
      ...availableRoles,
      {
        role: Role.PLAYER,
        team: Team.GREEN
      }
    ];
  }

  const [joinGame, { error, loading: joiningGame }] = useJoinGameMutation({
    onCompleted: data => {
      setUser(data.JoinGame);

      localStorage.setItem(`codenamesuser_name`, data.JoinGame.name);

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

  useEffect(() => {
    const name = localStorage.getItem(`codenamesuser_name`);
    if (name) {
      setName(name);
    }
  }, []);

  return (
    <Modal
      title="Join game"
      visible={visible}
      maskClosable={false}
      closable={false}
      footer={[
        <Button
          key="join-game-cta"
          type="primary"
          loading={joiningGame}
          disabled={!role || !team || !name}
          onClick={() => joinGame()}
        >
          JOIN GAME
        </Button>
      ]}
    >
      <Form
        layout="vertical"
        initialValues={{
          name
        }}
      >
        <Form.Item required label="Username:" name="name">
          <Input
            required
            prefix={<UserOutlined className="site-form-item-icon" />}
            onChange={e => setName(e.target.value)}
            value={name}
            placeholder="Choose a name"
          />
        </Form.Item>
        <Form.Item required label="Role:" name="role">
          <Radio.Group value={`${role}-${team}`}>
            {availableRoles.map(item => {
              return (
                <Radio.Button
                  key={`choose_role_team${item.role}-${item.tem}`}
                  value={`${item.role}-${item.team}`}
                  onChange={() => {
                    setRole(item.role);
                    setTeam(item.team);
                  }}
                >
                  {String(item.team).toUpperCase()}{' '}
                  {String(item.role).toUpperCase()}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JoinGame;
