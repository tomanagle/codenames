import * as React from 'react';
import { Button, Radio } from 'antd';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import App from '../components/App';
import { useStartGameMutation, Language } from '../generated';
import Head from 'next/head';
import useTranslation from '../locales/useTranslation';
import Error from '../components/Error';

const Background = styled.div`
  background-image: linear-gradient(
    to right top,
    #d16ba5,
    #c777b9,
    #ba83ca,
    #aa8fd8,
    #9a9ae1,
    #8aa7ec,
    #79b3f4,
    #69bff8,
    #52cffe,
    #41dfff,
    #46eefa,
    #5ffbf1
  );
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
`;

const Wrapper = styled.div`
  padding: 1rem;
  z-index: 2;
  position: relative;
  .inner {
    width: 100%;
    max-width: 30rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: rgba(256, 256, 256, 0.8);
    border-radius: 4px;
  }
`;

const Home = () => {
  const router = useRouter();
  const [language, setLanguage] = React.useState(Language.ENGLISH);
  const { t } = useTranslation();

  const [startGame, { loading, error }] = useStartGameMutation({
    variables: {
      input: {
        language
      }
    },
    onCompleted: data => {
      return router.push('/[permalink]', `/${data.StartGame.permalink}`);
    }
  });

  return (
    <App
      title="Codenames"
      description="Play codenames online with friends and family. Choose between family-friendly words or adult-only words."
    >
      <Head>
        <script
          type="text/javascript"
          src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5e88192c0627598b"
        ></script>
      </Head>
      <Background />

      <Wrapper>
        <div id="add-this-wrapper">
          <div className="addthis_floating_share_toolbox" />
        </div>

        <div className="inner">
          <h1>Playing codenames online with friends</h1>
          <p>To get started playing codenames online with your friends:</p>
          <ol>
            <li>Select your language</li>
            <li>Click 'START GAME'</li>
            <li>Select your team and role</li>
            <li>Share the link with your friends</li>
            <li>Start playing Codenames</li>
          </ol>

          {error && (
            <>
              <Error error={error} />
              <br />
            </>
          )}

          <Radio.Group
            onChange={e => setLanguage(e.target.value)}
            value={language}
            style={{ width: '100%' }}
          >
            <Radio.Button value={Language.ENGLISH}>
              Family-friendly (English)
            </Radio.Button>
            <Radio.Button value={Language.ADULT}>
              {Language.ADULT} (English)
            </Radio.Button>

            <Radio.Button value={Language.GERMAN}>
              {Language.GERMAN}
            </Radio.Button>

            <Radio.Button value={Language.SPANISH}>
              {Language.SPANISH}
            </Radio.Button>

            <Radio.Button value={Language.FRENCH}>
              {Language.FRENCH}
            </Radio.Button>

            <Radio.Button value={Language.ITALIAN}>
              {Language.ITALIAN}
            </Radio.Button>
          </Radio.Group>
          <br />
          <Button type="primary" loading={loading} onClick={() => startGame()}>
            {t('home.startButton')}
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
