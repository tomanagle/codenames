import { Result, Button, Modal } from 'antd';
import { useResetGameMutation } from '../generated';
const Winner = ({ winner, players, permalink }) => {
  if (!winner || !players.length) {
    return <div />;
  }

  const [restartGame, { loading }] = useResetGameMutation({
    variables: {
      input: {
        permalink
      }
    }
  });

  return (
    <Modal
      visible={true || !!winner}
      closable={false}
      maskClosable={false}
      footer={[
        <Button
          key="restart-game-cta"
          type="primary"
          loading={loading}
          onClick={() => restartGame()}
        >
          NEW GAME
        </Button>
      ]}
    >
      <Result
        status="success"
        title={`The ${String(winner).toUpperCase()} team are the winners`}
        subTitle={`Congratulations ${players[0].name} and ${players[1].name}! Your are the winners of the round.`}
      />
    </Modal>
  );
};

export default Winner;
