import { Button } from 'antd';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import App from '../components/App';
import { useStartGameMutation } from '../generated';
import Head from 'next/head';
import getBG from '../getRanomdBG';

const Wrapper = styled.div`
  ${getBG};
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  .inner {
    width: 100%;
    max-width: 30rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: rgba(256, 256, 256, 0.8);
  }
`;

const Home = () => {
  const router = useRouter();

  const [startGame, { loading }] = useStartGameMutation({
    onCompleted: data => {
      return router.push('/[permalink]', `/${data.StartGame.permalink}`);
    }
  });

  return (
    <App title="Codenames" description="Play codenames online with friends">
      <Head>
        <script
          type="text/javascript"
          src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5e88192c0627598b"
        ></script>
      </Head>

      <Wrapper>
        <div className="addthis_floating_share_toolbox" />
        <div className="inner">
          <h2>Start playing codenames online</h2>
          <p>
            Play Codenames Online with friends. To get started, click 'START
            GAME' and share the link with your friends.
          </p>
          <br />
          <Button type="primary" loading={loading} onClick={() => startGame()}>
            START GAME
          </Button>
          <br />
          <p>
            Codenames is a simple game to play. Simple, choose your team and
            your role. Each team will have a spymaster and a player. When it's
            your turn, the Spymaster will give the player a one word clue and a
            number of words that clue relates to. The player should then click
            the words that they think the clue relates to. Whoever finds all the
            words first, wins!
          </p>
          <p>
            Each round will include a 'death' word. Be sure to not click it or
            you and your teammate will instantly lose the game.
          </p>
        </div>
      </Wrapper>
    </App>
  );
};

export default Home;
