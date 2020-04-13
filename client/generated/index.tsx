// THIS IS A GENERATED FILE, use `yarn generate:graphql to regenerate
import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as React from 'react';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum CacheControlScope {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export type EndTurnInput = {
  readonly permalink: Scalars['String'];
};

export type Game = {
  readonly __typename?: 'Game';
  readonly _id: Scalars['ID'];
  readonly permalink: Scalars['String'];
  readonly users?: Maybe<ReadonlyArray<Maybe<User>>>;
  readonly words?: Maybe<ReadonlyArray<Maybe<Word>>>;
  readonly currentTurn?: Maybe<Team>;
  readonly winner?: Maybe<Team>;
  readonly finished?: Maybe<Scalars['Boolean']>;
};

export type GameUpdatedInput = {
  readonly permalink?: Maybe<Scalars['String']>;
};

export type GetGameInput = {
  readonly permalink: Scalars['String'];
};

export type JoinGameInput = {
  readonly permalink: Scalars['String'];
  readonly team: Team;
  readonly role: Role;
  readonly name?: Maybe<Scalars['String']>;
};

export enum Language {
  ENGLISH = 'English',
  ADULT = 'Adult'
}

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly StartGame?: Maybe<Game>;
  readonly JoinGame: User;
  readonly PickWord?: Maybe<Game>;
  readonly ResetGame: Game;
  readonly EndTurn: Game;
};


export type MutationJoinGameArgs = {
  input: JoinGameInput;
};


export type MutationPickWordArgs = {
  input: PickWordInput;
};


export type MutationResetGameArgs = {
  input: ResetGameInput;
};


export type MutationEndTurnArgs = {
  input: EndTurnInput;
};

export type PickWordInput = {
  readonly word: Scalars['ID'];
  readonly user: Scalars['ID'];
  readonly permalink: Scalars['String'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly game?: Maybe<Game>;
};


export type QueryGameArgs = {
  input: GetGameInput;
};

export type ResetGameInput = {
  readonly gameId: Scalars['ID'];
};

export enum Role {
  SPYMASTER = 'spymaster',
  PLAYER = 'player'
}

export type Subscription = {
  readonly __typename?: 'Subscription';
  readonly GameUpdated?: Maybe<Game>;
};


export type SubscriptionGameUpdatedArgs = {
  input: GameUpdatedInput;
};

export enum Team {
  RED = 'red',
  GREEN = 'green',
  NONE = 'none'
}


export type User = {
  readonly __typename?: 'User';
  readonly _id: Scalars['ID'];
  readonly team: Team;
  readonly role: Role;
  readonly name?: Maybe<Scalars['String']>;
};

export type Word = {
  readonly __typename?: 'Word';
  readonly _id: Scalars['ID'];
  readonly label: Scalars['String'];
  readonly team?: Maybe<Team>;
  readonly picked?: Maybe<Scalars['Boolean']>;
  readonly death?: Maybe<Scalars['Boolean']>;
  readonly language?: Maybe<Language>;
};

export type EndTurnMutationVariables = {
  input: EndTurnInput;
};


export type EndTurnMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly EndTurn: (
    { readonly __typename?: 'Game' }
    & Pick<Game, '_id' | 'currentTurn' | 'winner' | 'finished'>
    & { readonly words?: Maybe<ReadonlyArray<Maybe<(
      { readonly __typename?: 'Word' }
      & Pick<Word, '_id' | 'label' | 'team' | 'picked' | 'death'>
    )>>>, readonly users?: Maybe<ReadonlyArray<Maybe<(
      { readonly __typename?: 'User' }
      & Pick<User, '_id' | 'role' | 'team'>
    )>>> }
  ) }
);

export type PickWordMutationVariables = {
  input: PickWordInput;
};


export type PickWordMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly PickWord?: Maybe<(
    { readonly __typename?: 'Game' }
    & Pick<Game, '_id' | 'currentTurn' | 'winner' | 'finished'>
    & { readonly words?: Maybe<ReadonlyArray<Maybe<(
      { readonly __typename?: 'Word' }
      & Pick<Word, '_id' | 'label' | 'team' | 'picked' | 'death'>
    )>>>, readonly users?: Maybe<ReadonlyArray<Maybe<(
      { readonly __typename?: 'User' }
      & Pick<User, '_id' | 'role' | 'team'>
    )>>> }
  )> }
);

export type JoinGameMutationVariables = {
  input: JoinGameInput;
};


export type JoinGameMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly JoinGame: (
    { readonly __typename?: 'User' }
    & Pick<User, '_id' | 'name' | 'team' | 'role'>
  ) }
);

export type StartGameMutationVariables = {};


export type StartGameMutation = (
  { readonly __typename?: 'Mutation' }
  & { readonly StartGame?: Maybe<(
    { readonly __typename?: 'Game' }
    & Pick<Game, '_id' | 'permalink' | 'currentTurn' | 'winner' | 'finished'>
    & { readonly words?: Maybe<ReadonlyArray<Maybe<(
      { readonly __typename?: 'Word' }
      & Pick<Word, '_id' | 'label' | 'team' | 'picked' | 'death'>
    )>>>, readonly users?: Maybe<ReadonlyArray<Maybe<(
      { readonly __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'role' | 'team'>
    )>>> }
  )> }
);

export type GameUpdatedSubscriptionVariables = {
  input: GameUpdatedInput;
};


export type GameUpdatedSubscription = (
  { readonly __typename?: 'Subscription' }
  & { readonly GameUpdated?: Maybe<(
    { readonly __typename?: 'Game' }
    & Pick<Game, '_id' | 'currentTurn' | 'winner' | 'finished'>
    & { readonly words?: Maybe<ReadonlyArray<Maybe<(
      { readonly __typename?: 'Word' }
      & Pick<Word, '_id' | 'label' | 'team' | 'picked' | 'death'>
    )>>>, readonly users?: Maybe<ReadonlyArray<Maybe<(
      { readonly __typename?: 'User' }
      & Pick<User, '_id' | 'role' | 'team' | 'name'>
    )>>> }
  )> }
);

export type GameQueryVariables = {
  input: GetGameInput;
};


export type GameQuery = (
  { readonly __typename?: 'Query' }
  & { readonly game?: Maybe<(
    { readonly __typename?: 'Game' }
    & Pick<Game, '_id' | 'currentTurn' | 'winner' | 'finished'>
    & { readonly words?: Maybe<ReadonlyArray<Maybe<(
      { readonly __typename?: 'Word' }
      & Pick<Word, '_id' | 'label' | 'team' | 'picked' | 'death'>
    )>>>, readonly users?: Maybe<ReadonlyArray<Maybe<(
      { readonly __typename?: 'User' }
      & Pick<User, '_id' | 'role' | 'team' | 'name'>
    )>>> }
  )> }
);


export const EndTurnDocument = gql`
    mutation EndTurn($input: EndTurnInput!) {
  EndTurn(input: $input) {
    _id
    currentTurn
    winner
    finished
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
export type EndTurnMutationFn = ApolloReactCommon.MutationFunction<EndTurnMutation, EndTurnMutationVariables>;
export type EndTurnComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<EndTurnMutation, EndTurnMutationVariables>, 'mutation'>;

    export const EndTurnComponent = (props: EndTurnComponentProps) => (
      <ApolloReactComponents.Mutation<EndTurnMutation, EndTurnMutationVariables> mutation={EndTurnDocument} {...props} />
    );
    
export type EndTurnProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
      [key in TDataName]: ApolloReactCommon.MutationFunction<EndTurnMutation, EndTurnMutationVariables>
    } & TChildProps;
export function withEndTurn<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  EndTurnMutation,
  EndTurnMutationVariables,
  EndTurnProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withMutation<TProps, EndTurnMutation, EndTurnMutationVariables, EndTurnProps<TChildProps, TDataName>>(EndTurnDocument, {
      alias: 'endTurn',
      ...operationOptions
    });
};

/**
 * __useEndTurnMutation__
 *
 * To run a mutation, you first call `useEndTurnMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEndTurnMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [endTurnMutation, { data, loading, error }] = useEndTurnMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEndTurnMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EndTurnMutation, EndTurnMutationVariables>) {
        return ApolloReactHooks.useMutation<EndTurnMutation, EndTurnMutationVariables>(EndTurnDocument, baseOptions);
      }
export type EndTurnMutationHookResult = ReturnType<typeof useEndTurnMutation>;
export type EndTurnMutationResult = ApolloReactCommon.MutationResult<EndTurnMutation>;
export type EndTurnMutationOptions = ApolloReactCommon.BaseMutationOptions<EndTurnMutation, EndTurnMutationVariables>;
export const PickWordDocument = gql`
    mutation PickWord($input: PickWordInput!) {
  PickWord(input: $input) {
    _id
    currentTurn
    winner
    finished
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
export type PickWordMutationFn = ApolloReactCommon.MutationFunction<PickWordMutation, PickWordMutationVariables>;
export type PickWordComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<PickWordMutation, PickWordMutationVariables>, 'mutation'>;

    export const PickWordComponent = (props: PickWordComponentProps) => (
      <ApolloReactComponents.Mutation<PickWordMutation, PickWordMutationVariables> mutation={PickWordDocument} {...props} />
    );
    
export type PickWordProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
      [key in TDataName]: ApolloReactCommon.MutationFunction<PickWordMutation, PickWordMutationVariables>
    } & TChildProps;
export function withPickWord<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  PickWordMutation,
  PickWordMutationVariables,
  PickWordProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withMutation<TProps, PickWordMutation, PickWordMutationVariables, PickWordProps<TChildProps, TDataName>>(PickWordDocument, {
      alias: 'pickWord',
      ...operationOptions
    });
};

/**
 * __usePickWordMutation__
 *
 * To run a mutation, you first call `usePickWordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePickWordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pickWordMutation, { data, loading, error }] = usePickWordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePickWordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PickWordMutation, PickWordMutationVariables>) {
        return ApolloReactHooks.useMutation<PickWordMutation, PickWordMutationVariables>(PickWordDocument, baseOptions);
      }
export type PickWordMutationHookResult = ReturnType<typeof usePickWordMutation>;
export type PickWordMutationResult = ApolloReactCommon.MutationResult<PickWordMutation>;
export type PickWordMutationOptions = ApolloReactCommon.BaseMutationOptions<PickWordMutation, PickWordMutationVariables>;
export const JoinGameDocument = gql`
    mutation JoinGame($input: JoinGameInput!) {
  JoinGame(input: $input) {
    _id
    name
    team
    role
  }
}
    `;
export type JoinGameMutationFn = ApolloReactCommon.MutationFunction<JoinGameMutation, JoinGameMutationVariables>;
export type JoinGameComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<JoinGameMutation, JoinGameMutationVariables>, 'mutation'>;

    export const JoinGameComponent = (props: JoinGameComponentProps) => (
      <ApolloReactComponents.Mutation<JoinGameMutation, JoinGameMutationVariables> mutation={JoinGameDocument} {...props} />
    );
    
export type JoinGameProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
      [key in TDataName]: ApolloReactCommon.MutationFunction<JoinGameMutation, JoinGameMutationVariables>
    } & TChildProps;
export function withJoinGame<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  JoinGameMutation,
  JoinGameMutationVariables,
  JoinGameProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withMutation<TProps, JoinGameMutation, JoinGameMutationVariables, JoinGameProps<TChildProps, TDataName>>(JoinGameDocument, {
      alias: 'joinGame',
      ...operationOptions
    });
};

/**
 * __useJoinGameMutation__
 *
 * To run a mutation, you first call `useJoinGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinGameMutation, { data, loading, error }] = useJoinGameMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useJoinGameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<JoinGameMutation, JoinGameMutationVariables>) {
        return ApolloReactHooks.useMutation<JoinGameMutation, JoinGameMutationVariables>(JoinGameDocument, baseOptions);
      }
export type JoinGameMutationHookResult = ReturnType<typeof useJoinGameMutation>;
export type JoinGameMutationResult = ApolloReactCommon.MutationResult<JoinGameMutation>;
export type JoinGameMutationOptions = ApolloReactCommon.BaseMutationOptions<JoinGameMutation, JoinGameMutationVariables>;
export const StartGameDocument = gql`
    mutation StartGame {
  StartGame {
    _id
    permalink
    currentTurn
    winner
    finished
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
      name
    }
  }
}
    `;
export type StartGameMutationFn = ApolloReactCommon.MutationFunction<StartGameMutation, StartGameMutationVariables>;
export type StartGameComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<StartGameMutation, StartGameMutationVariables>, 'mutation'>;

    export const StartGameComponent = (props: StartGameComponentProps) => (
      <ApolloReactComponents.Mutation<StartGameMutation, StartGameMutationVariables> mutation={StartGameDocument} {...props} />
    );
    
export type StartGameProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
      [key in TDataName]: ApolloReactCommon.MutationFunction<StartGameMutation, StartGameMutationVariables>
    } & TChildProps;
export function withStartGame<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  StartGameMutation,
  StartGameMutationVariables,
  StartGameProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withMutation<TProps, StartGameMutation, StartGameMutationVariables, StartGameProps<TChildProps, TDataName>>(StartGameDocument, {
      alias: 'startGame',
      ...operationOptions
    });
};

/**
 * __useStartGameMutation__
 *
 * To run a mutation, you first call `useStartGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startGameMutation, { data, loading, error }] = useStartGameMutation({
 *   variables: {
 *   },
 * });
 */
export function useStartGameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<StartGameMutation, StartGameMutationVariables>) {
        return ApolloReactHooks.useMutation<StartGameMutation, StartGameMutationVariables>(StartGameDocument, baseOptions);
      }
export type StartGameMutationHookResult = ReturnType<typeof useStartGameMutation>;
export type StartGameMutationResult = ApolloReactCommon.MutationResult<StartGameMutation>;
export type StartGameMutationOptions = ApolloReactCommon.BaseMutationOptions<StartGameMutation, StartGameMutationVariables>;
export const GameUpdatedDocument = gql`
    subscription GameUpdated($input: GameUpdatedInput!) {
  GameUpdated(input: $input) {
    _id
    currentTurn
    winner
    finished
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
export type GameUpdatedComponentProps = Omit<ApolloReactComponents.SubscriptionComponentOptions<GameUpdatedSubscription, GameUpdatedSubscriptionVariables>, 'subscription'>;

    export const GameUpdatedComponent = (props: GameUpdatedComponentProps) => (
      <ApolloReactComponents.Subscription<GameUpdatedSubscription, GameUpdatedSubscriptionVariables> subscription={GameUpdatedDocument} {...props} />
    );
    
export type GameUpdatedProps<TChildProps = {}, TDataName extends string = 'data'> = {
      [key in TDataName]: ApolloReactHoc.DataValue<GameUpdatedSubscription, GameUpdatedSubscriptionVariables>
    } & TChildProps;
export function withGameUpdated<TProps, TChildProps = {}, TDataName extends string = 'data'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  GameUpdatedSubscription,
  GameUpdatedSubscriptionVariables,
  GameUpdatedProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withSubscription<TProps, GameUpdatedSubscription, GameUpdatedSubscriptionVariables, GameUpdatedProps<TChildProps, TDataName>>(GameUpdatedDocument, {
      alias: 'gameUpdated',
      ...operationOptions
    });
};

/**
 * __useGameUpdatedSubscription__
 *
 * To run a query within a React component, call `useGameUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGameUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameUpdatedSubscription({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGameUpdatedSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<GameUpdatedSubscription, GameUpdatedSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<GameUpdatedSubscription, GameUpdatedSubscriptionVariables>(GameUpdatedDocument, baseOptions);
      }
export type GameUpdatedSubscriptionHookResult = ReturnType<typeof useGameUpdatedSubscription>;
export type GameUpdatedSubscriptionResult = ApolloReactCommon.SubscriptionResult<GameUpdatedSubscription>;
export const GameDocument = gql`
    query game($input: GetGameInput!) {
  game(input: $input) {
    _id
    currentTurn
    winner
    finished
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
export type GameComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GameQuery, GameQueryVariables>, 'query'> & ({ variables: GameQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GameComponent = (props: GameComponentProps) => (
      <ApolloReactComponents.Query<GameQuery, GameQueryVariables> query={GameDocument} {...props} />
    );
    
export type GameProps<TChildProps = {}, TDataName extends string = 'data'> = {
      [key in TDataName]: ApolloReactHoc.DataValue<GameQuery, GameQueryVariables>
    } & TChildProps;
export function withGame<TProps, TChildProps = {}, TDataName extends string = 'data'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  GameQuery,
  GameQueryVariables,
  GameProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withQuery<TProps, GameQuery, GameQueryVariables, GameProps<TChildProps, TDataName>>(GameDocument, {
      alias: 'game',
      ...operationOptions
    });
};

/**
 * __useGameQuery__
 *
 * To run a query within a React component, call `useGameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGameQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GameQuery, GameQueryVariables>) {
        return ApolloReactHooks.useQuery<GameQuery, GameQueryVariables>(GameDocument, baseOptions);
      }
export function useGameLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GameQuery, GameQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GameQuery, GameQueryVariables>(GameDocument, baseOptions);
        }
export type GameQueryHookResult = ReturnType<typeof useGameQuery>;
export type GameLazyQueryHookResult = ReturnType<typeof useGameLazyQuery>;
export type GameQueryResult = ApolloReactCommon.QueryResult<GameQuery, GameQueryVariables>;