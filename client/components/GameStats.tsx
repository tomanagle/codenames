import { Row, Col } from 'antd';
import styled from 'styled-components';
import { Team } from '../generated';

const WordsLeft = styled.div`
  padding: 1rem 1.5rem;
  font-size: 1.5rem;
  border-radius: 5px;
  color: #ffffff;
  line-height: 1;
  background-color: ${props =>
    props.team === Team.RED ? '#ff1744' : '#00c853'};
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const GameStats = ({ game }) => {
  const redWords = game.words.filter(item => item.team === Team.RED);
  const redWordsPicked = redWords.filter(item => item.picked);
  const greenWords = game.words.filter(item => item.team === Team.GREEN);
  const greenWordsPicked = greenWords.filter(item => item.picked);

  if (redWords.length === 9) {
    return (
      <Row>
        <WordsLeft team={Team.RED}>
          {redWords.length - redWordsPicked.length}
        </WordsLeft>
        <WordsLeft team={Team.GREEN}>
          {greenWords.length - greenWordsPicked.length}
        </WordsLeft>
      </Row>
    );
  }

  return (
    <Row>
      <WordsLeft team={Team.GREEN}>
        {greenWords.length - greenWordsPicked.length}
      </WordsLeft>
      <WordsLeft team={Team.RED}>
        {redWords.length - redWordsPicked.length}
      </WordsLeft>
    </Row>
  );
};

export default GameStats;
