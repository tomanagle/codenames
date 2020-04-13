import { Button } from 'antd';
import { useRouter } from 'next/router';
import App from '../components/App';
import { useStartGameMutation } from '../generated';

const Home = () => {
  const router = useRouter();

  const [startGame, { loading }] = useStartGameMutation({
    onCompleted: data => {
      return router.push('/[permalink]', `/${data.StartGame.permalink}`);
    }
  });

  return (
    <App title="Codenames" description="Play codenames online with friends">
      <Button loading={loading} onClick={() => startGame()}>
        START GAME
      </Button>
    </App>
  );
};

export default Home;
