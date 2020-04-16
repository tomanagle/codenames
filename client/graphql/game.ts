import gql from 'graphql-tag';

export const END_TURN_MUTATION = gql`
  mutation EndTurn($input: EndTurnInput!) {
    EndTurn(input: $input) {
      _id
      currentTurn
      winner
      finished
      permalink
      language
      words {
        _id
        label
        team
        picked
        death
      }
      users {
        _id
        role
        team
      }
    }
  }
`;

export const PICK_WORD_MUTATION = gql`
  mutation PickWord($input: PickWordInput!) {
    PickWord(input: $input) {
      _id
      currentTurn
      winner
      finished
      permalink
      language
      words {
        _id
        label
        team
        picked
        death
      }
      users {
        _id
        role
        team
      }
    }
  }
`;

export const JOIN_GAME_MUTATION = gql`
  mutation JoinGame($input: JoinGameInput!) {
    JoinGame(input: $input) {
      _id
      name
      team
      role
    }
  }
`;

export const START_GAME_MUTATION = gql`
  mutation StartGame($input: StartGameInput) {
    StartGame(input: $input) {
      _id
      currentTurn
      winner
      finished
      permalink
      language
      words {
        _id
        label
        team
        picked
        death
      }
      users {
        _id
        name
        role
        team
      }
    }
  }
`;

export const GAME_SUBSCRIPTION = gql`
  subscription GameUpdated($input: GameUpdatedInput!) {
    GameUpdated(input: $input) {
      _id
      currentTurn
      winner
      finished
      permalink
      language
      words {
        _id
        label
        team
        picked
        death
      }
      users {
        _id
        role
        team
        name
      }
    }
  }
`;

export const GAME_QUERY = gql`
  query game($input: GetGameInput!) {
    game(input: $input) {
      _id
      currentTurn
      winner
      finished
      permalink
      language
      words {
        _id
        label
        team
        picked
        death
      }
      users {
        _id
        role
        team
        name
      }
    }
  }
`;

export const RESTART_GAME_MUTATION = gql`
  mutation ResetGame($input: ResetGameInput!) {
    ResetGame(input: $input) {
      _id
      currentTurn
      winner
      finished
      permalink
      language
      words {
        _id
        label
        team
        picked
        death
      }
      users {
        _id
        role
        team
        name
      }
    }
  }
`;
