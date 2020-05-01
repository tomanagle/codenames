import React, { useState } from 'react';
import { Row, Col, Button, Spin, Alert as _Alert, Input, message } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Game,
  usePickWordMutation,
  User,
  Role,
  useEndTurnMutation,
  Team
} from '../generated';
import GameStats from '../components/GameStats';
import { RED_COLOUR, BLUE_COLOUR } from '../constants';

const CopyWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const Alert = styled(_Alert)`
  color: #333;

  span.ant-alert-message {
    color: #333;
  }

  background-color: ${props =>
    props.currentTurn === Team.RED
      ? 'rgba(255,23,68, .1)'
      : 'rgba(34, 150, 242, .1)'};

  border-color: ${props =>
    props.currentTurn === Team.RED ? 'rgb(255,23,68)' : 'rgb(34, 150, 242)'};
`;

const GameWrapper = styled.div`
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
  min-height: calc(100vh - 20px);

  display: flex;
  flex-direction: column;
`;

const GameBoardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex: 1;
`;

const Tile = styled.div`
  width: 20%;
  text-align: center;

  button {
    width: 100%;
    padding: 1rem;
    text-transform: uppercase;
    font-size: 1rem;
    cursor: pointer;
    background-color: #fff;
    border: solid 1px #ccc;
    color: #333;
    height: 100%;
  }

  @media screen and (max-width: 599px) {
    button {
      font-size: 0.75rem;
      padding: 0.5rem;
    }
  }

  button:disabled {
    cursor: default;
  }

  button.role__spymaster.word-team__red.picked__false {
    background-color: #fff;
    color: ${RED_COLOUR};
  }

  button.role__spymaster.word-team__blue.picked__false {
    background-color: #fff;
    color: ${BLUE_COLOUR};
  }

  button.word-team__red.picked__true {
    background-color: ${RED_COLOUR};
    color: #fff;
  }

  button.word-team__blue.picked__true {
    background-color: ${BLUE_COLOUR};
    color: #fff;
  }

  button.picked__true.is_death__true {
    background-color: #000 !important;
    color: #fff !important;
  }

  button.role__spymaster.picked__false.is_death__true {
    background-color: #ccc;
    color: #000;
  }

  button.word-team__none.picked__true {
    background-color: ${RED_COLOUR};
    color: #000;
  }
`;

const GameContainer = ({
  game,
  user,
  permalink,
  readyUsersLength
}: {
  game: Game;
  user: User;
  permalink: Game['permalink'];
  readyUsersLength: number;
}) => {
  const [loading, setLoading] = useState('');
  const [pickWord] = usePickWordMutation({
    onCompleted: () => {
      setLoading('');
    }
  });
  const [endTurn, { loading: endTurnLoading }] = useEndTurnMutation({
    variables: {
      input: {
        permalink
      }
    }
  });

  return (
    <GameWrapper>
      {readyUsersLength < 4 ? (
        <>
          {user && user.name && (
            <Alert
              message={`Welcome ${user.name}!`}
              description={`To get started share the link below with your
              friends and family. When all players join the game, you will be
              able to start playing. We currently have ${readyUsersLength} 
              ${
                readyUsersLength > 1 ? 'users' : 'user'
              } in the room and we need 4 start
              start. Share the link below with the people you want to play with.`}
            />
          )}
          <CopyWrapper>
            <ArrowRightOutlined
              style={{ marginRight: '.5rem', fontSize: '1.5rem' }}
            />
            <Input
              value={`https://playcodenames.online/${permalink}`}
              id="game-url"
            />
            <CopyToClipboard
              text={`https://playcodenames.online/${permalink}/?utm_source=start_game&utm_medium=share&utm_campaign=copy_link`}
              onCopy={() =>
                message.success(
                  'Copied to clipboard. Now share it with your friends!',
                  30
                )
              }
            >
              <>
                <Button>Copy to clipboard</Button>
                <ArrowLeftOutlined
                  style={{ marginLeft: '.5rem', fontSize: '1.5rem' }}
                />
              </>
            </CopyToClipboard>
          </CopyWrapper>
        </>
      ) : (
        <>
          {user.team === game.currentTurn && (
            <Alert
              message="It's your turn!"
              description={
                user.role === Role.SPYMASTER
                  ? `Give your team mate a one word clue to help them file all the ${String(
                      game.currentTurn
                    ).toUpperCase()} words.`
                  : `Use your Spymaster's clue to find all the ${String(
                      game.currentTurn
                    ).toUpperCase()} words.`
              }
              currentTurn={game.currentTurn}
              type="success"
            />
          )}
          {user.team !== game.currentTurn && (
            <Alert
              message={`Wait for the ${String(
                game.currentTurn
              ).toUpperCase()} team`}
              description={`It's the ${String(
                game.currentTurn
              ).toUpperCase()} team's turn, wait
      for them to finish.`}
              type="info"
              currentTurn={game.currentTurn}
            />
          )}
        </>
      )}
      <Row align="middle">
        <Col flex="1">
          <GameStats game={game} />
        </Col>
        {user.team === game.currentTurn && (
          <Col>
            <Button
              type="primary"
              disabled={readyUsersLength < 4}
              loading={endTurnLoading}
              onClick={() => endTurn()}
            >
              END TURN
            </Button>
          </Col>
        )}
      </Row>

      <GameBoardWrapper>
        {game.words.map(word => {
          return (
            <Tile key={`word__${word._id}`}>
              <button
                className={`role__${user.role} team__${user.team} word-team__${
                  word.team
                } picked__${String(word.picked)} is_death__${String(
                  word.death
                )}`}
                disabled={
                  readyUsersLength < 4 ||
                  game.winner !== Team.NONE ||
                  game.currentTurn !== user.team ||
                  user.role === Role.SPYMASTER
                }
                onClick={() => {
                  setLoading(word._id);
                  pickWord({
                    variables: {
                      input: {
                        permalink,
                        user: user._id,
                        word: word._id
                      }
                    }
                  });
                }}
              >
                {word.label}
                {loading === word._id ? <Spin /> : null}
              </button>
            </Tile>
          );
        })}
      </GameBoardWrapper>
    </GameWrapper>
  );
};

export default GameContainer;
