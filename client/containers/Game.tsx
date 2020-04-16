import React, { useState } from 'react';
import { Row, Col, Button, Spin } from 'antd';
import styled from 'styled-components';
import {
  Game,
  usePickWordMutation,
  User,
  Role,
  Team,
  useEndTurnMutation
} from '../generated';
import GameStats from '../components/GameStats';

function getBackgroundColour(user, word) {
  if (word.picked && word.team === Team.GREEN) {
    return 'green';
  }

  if (word.picked && word.team === Team.RED) {
    return 'red';
  }

  return 'transparent';
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
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
  }

  button:disabled {
    cursor: default;
  }

  button.role__spymaster.team__red.word-team__red.picked__false {
    background-color: #fff;
    color: #ff1744;
  }

  button.role__spymaster.team__green.word-team__green.picked__false {
    background-color: #fff;
    color: #00c853;
  }

  button.word-team__red.picked__true {
    background-color: #ff1744;
    color: #fff;
  }

  button.word-team__green.picked__true {
    background-color: #00c853;
    color: #fff;
  }

  button.picked__true.is_death__true {
    background-color: #000;
    color: #fff;
  }

  button.word-team__none.picked__true {
    background-color: #f8f8f8;
    color: #000;
  }
`;

const GameContainer = ({
  game,
  user,
  permalink
}: {
  game: Game;
  user: User;
  permalink: Game['permalink'];
}) => {
  const [loading, setLoading] = useState('');
  const [pickWord] = usePickWordMutation({
    onCompleted: () => {
      setLoading('');
    }
  });
  const [endTurn] = useEndTurnMutation({
    variables: {
      input: {
        permalink
      }
    }
  });

  return (
    <>
      {user.team === game.currentTurn && (
        <p>Go {String(game.currentTurn).toUpperCase()} team, it's your turn.</p>
      )}
      {user.team !== game.currentTurn && (
        <p>
          It's the {String(game.currentTurn).toUpperCase()} team's turn, wait
          for them to finish.
        </p>
      )}
      <Row align="middle">
        <Col flex="1">
          <GameStats game={game} />
        </Col>
        {user.team === game.currentTurn && (
          <Col>
            <Button onClick={() => endTurn()}>END TURN</Button>
          </Col>
        )}
      </Row>
      <Wrapper>
        {game.words.map(word => {
          return (
            <Tile xs={6} sm={6} md={6} lg={6} xl={6} key={`word__${word._id}`}>
              <button
                className={`role__${user.role} team__${user.team} word-team__${
                  word.team
                } picked__${String(word.picked)} is_death__${String(
                  word.death
                )}`}
                disabled={
                  game.currentTurn !== user.team || user.role === Role.SPYMASTER
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
      </Wrapper>
    </>
  );
};

export default GameContainer;
