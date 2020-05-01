import { Row, Col } from 'antd';
import styled from 'styled-components';
import { Team } from '../generated';
import { RED_COLOUR, BLUE_COLOUR } from '../constants';

const WordsLeft = styled.div`
  padding: 1rem 1.5rem;
  font-size: 1.5rem;
  border-radius: 5px;
  color: #ffffff;
  line-height: 1;
  background-color: ${props =>
    props.team === Team.RED ? RED_COLOUR : BLUE_COLOUR};
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  :nth-of-type(1) {
    margin-right: 0.5rem;
  }
`;

const GameStats = ({ game }) => {
  const redWords = game.words.filter(item => item.team === Team.RED);
  const redWordsPicked = redWords.filter(item => item.picked);
  const blueWords = game.words.filter(item => item.team === Team.BLUE);
  const blueWordsPicked = blueWords.filter(item => item.picked);

  if (redWords.length === 9) {
    return (
      <Row>
        <WordsLeft team={Team.RED}>
          {redWords.length - redWordsPicked.length}
        </WordsLeft>
        <WordsLeft team={Team.BLUE}>
          {blueWords.length - blueWordsPicked.length}
        </WordsLeft>
      </Row>
    );
  }

  return (
    <Row>
      <WordsLeft team={Team.BLUE}>
        {blueWords.length - blueWordsPicked.length}
      </WordsLeft>
      <WordsLeft team={Team.RED}>
        {redWords.length - redWordsPicked.length}
      </WordsLeft>
    </Row>
  );
};

export default GameStats;
