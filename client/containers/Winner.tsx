import { Result, Button, Modal } from 'antd';

const Winner = ({ winner, players }) => {
  if (!winner || !players.length) {
    return <div />;
  }

  return (
    <Modal visible={!!winner}>
      <Result
        status="success"
        title={`The ${String(winner).toUpperCase()} team are the winners`}
        subTitle={`Congratulations ${players[0].name} and ${players[1].name}! Your are the winners of the round.`}
      />
    </Modal>
  );
};

export default Winner;
