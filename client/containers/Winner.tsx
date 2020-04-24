import * as React from 'react';
import { Result, Button, Modal } from 'antd';
import { useRouter } from 'next/router';
import { useResetGameMutation } from '../generated';
const Winner = ({ winner, players, permalink }) => {
  const [closed, setClosed] = React.useState(false);
  const router = useRouter();
  const [restartGame, { loading }] = useResetGameMutation({
    variables: {
      input: {
        permalink
      }
    }
  });

  if (!winner || !players.length) {
    return <div />;
  }

  return (
    <Modal
      visible={!!winner && !closed}
      onCancel={() => setClosed(true)}
      footer={[
        <Button
          key="restart-game-cta"
          loading={loading}
          onClick={() => router.push('/')}
        >
          HOME
        </Button>,
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
