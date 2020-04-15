import { Row, Col, Button } from 'antd';
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
  border: solid 1px black;
  text-align: center;

  button {
    color: ${props => (props.isSpyMaster ? `${props.teamColour};` : 'black;')}
    width: 100%;
    background-color: ${props => props.backgroundColor};
    padding: 1rem;
    text-transform: uppercase;
    font-size: 1rem;
    cursor: pointer;
  }

  button:disabled {
    cursor: default;
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
  const [pickWord] = usePickWordMutation();
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
            <Tile
              backgroundColor={getBackgroundColour(user, word)}
              isSpyMaster={
                user.role === Role.SPYMASTER && word.team === user.team
              }
              teamColour={user.team === Team.RED ? '#ff1744' : '#00c853'}
              xs={6}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              key={`word__${word._id}`}
            >
              <button
                disabled={
                  game.currentTurn !== user.team || user.role === Role.SPYMASTER
                }
                onClick={() => {
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
                team: {word.team}
                <br />
                death: {word.death ? 'death word' : ''}
                <br />
                {word.label}
              </button>
            </Tile>
          );
        })}
      </Wrapper>
    </>
  );
};

export default GameContainer;
