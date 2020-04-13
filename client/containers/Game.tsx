import { Row, Col } from 'antd';
import styled from 'styled-components';
import { Game, usePickWordMutation, User, Role, Team } from '../generated';

function getBackgroundColour(user, word) {
  if (word.picked && word.team === Team.GREEN) {
    return 'green';
  }

  if (word.picked && word.team === Team.RED) {
    return 'red';
  }

  if (user.role === Role.PLAYER) {
    return 'transparent';
  }

  if (word.team === user.team && word.team === Team.GREEN) {
    return 'green';
  }

  if (word.team === user.team && word.team === Team.RED) {
    return 'red';
  }
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
    width: 100%;
    background-color: ${props => props.backgroundColor};
    padding: 1rem;
    text-transform: uppercase;
    font-size: 1rem;
    cursor: pointer;
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

  const redWords = game.words.filter(item => item.team === Team.RED);
  const redWordsPicked = redWords.filter(item => item.picked);
  const greenWords = game.words.filter(item => item.team === Team.GREEN);
  const greenWordsPicked = greenWords.filter(item => item.picked);
  return (
    <>
      <br />
      red: {redWordsPicked.length}/{redWords.length}
      <br />
      green: {greenWordsPicked.length}/{greenWords.length}
      <br />
      currentTurn: {game.currentTurn}
      <br />
      finished: {String(game.finished)}
      <br />
      winner: {String(game.winner)}
      <Wrapper>
        {game.words.map(word => {
          return (
            <Tile
              backgroundColor={getBackgroundColour(user, word)}
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
                team: {String(word.team)}
                <br />
                picked: {String(word.picked)}
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
