import { Row, Col } from 'antd';
import styled from 'styled-components';
import { Game, usePickWordMutation, User, Role, Team } from '../generated';
import GameStats from '../components/GameStats';

const WordsLeft = styled.div``;

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

  return (
    <>
      currentTurn: {game.currentTurn}
      <br />
      finished: {String(game.finished)}
      <br />
      winner: {String(game.winner)}
      <GameStats game={game} />
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
                death: {word.death}
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
