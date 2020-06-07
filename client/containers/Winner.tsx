import * as React from 'react';
import { Result, Button, Modal, Alert } from 'antd';
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
        <Button key="restart-game-cta" onClick={() => router.push('/')}>
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

      <Alert
        message="If you enjoyed playing Codenames online, please consider donating a little as $3 USD to help keep the game alive. I host this game at my own expense and want to be able to continue but I need your support."
        type="success"
      />
      <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
        <Button
          type="primary"
          href="https://www.buymeacoffee.com/tomn"
          target="_blank"
          rel="noopener noreferrer"
        >
          DONATE
        </Button>
      </div>
    </Modal>
  );
};

export default Winner;
