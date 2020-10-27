import { connect, DefaultRootState } from 'react-redux';
import { Dispatch } from 'redux';

export interface ReduxComposedProps<
    TPropsFromParent = undefined,
    TPropsFromReduxState = undefined,
    TPropsFromReduxDispatch = undefined
> {
    fromParent: TPropsFromParent;
    fromReduxState: TPropsFromReduxState;
    fromReduxDispatch: TPropsFromReduxDispatch;
    all: TPropsFromParent extends undefined
        ? TPropsFromReduxState extends undefined
            ? TPropsFromReduxDispatch extends undefined
                ? {}
                : TPropsFromReduxDispatch
            : TPropsFromReduxDispatch extends undefined
            ? TPropsFromReduxState
            : TPropsFromReduxState & TPropsFromReduxDispatch
        : TPropsFromReduxState extends undefined
        ? TPropsFromReduxDispatch extends undefined
            ? TPropsFromParent
            : TPropsFromParent & TPropsFromReduxDispatch
        : TPropsFromReduxDispatch extends undefined
        ? TPropsFromParent & TPropsFromReduxState
        : TPropsFromParent & TPropsFromReduxState & TPropsFromReduxDispatch;
}

export type ReduxConnectorProperties<
    TComponentProps extends ReduxComposedProps<
        TComponentProps['fromParent'],
        TComponentProps['fromReduxState'],
        TComponentProps['fromReduxDispatch']
    >,
    TState extends DefaultRootState = DefaultRootState,
    TDispatch extends Dispatch = Dispatch
> = TComponentProps extends {
    reduxState: infer TComponentState;
    reduxDispatch: infer TComponentDispatch;
}
    ? TComponentState extends undefined
        ? TComponentDispatch extends undefined
            ? {}
            : {
                  mapDispatchToProps: ReduxDispatchMapper<
                      TDispatch,
                      TComponentProps['fromParent'],
                      TComponentProps['fromReduxDispatch']
                  >;
              }
        : TComponentDispatch extends undefined
        ? {
              mapStateToProps: ReduxStateMapper<
                  TState,
                  TComponentProps['fromParent'],
                  TComponentProps['fromReduxState']
              >;
          }
        : {
              mapStateToProps: ReduxStateMapper<
                  TState,
                  TComponentProps['fromParent'],
                  TComponentProps['fromReduxState']
              >;
              mapDispatchToProps: ReduxDispatchMapper<
                  TDispatch,
                  TComponentProps['fromParent'],
                  TComponentProps['fromReduxDispatch']
              >;
          }
    : never;

type ReduxDispatchMapper<TDispatch, TPropsFromParent, fromReduxDispatch> = (
    dispatch: TDispatch,
    propsFromParent: TPropsFromParent
) => fromReduxDispatch;

type ReduxStateMapper<TState, TPropsFromParent, TPropsFromReduxState> = (
    state: TState,
    propsFromParent: TPropsFromParent
) => TPropsFromReduxState;

export const getReduxConnector = <
    TComponentProps extends ReduxComposedProps<
        TComponentProps['fromParent'],
        TComponentProps['fromReduxState'],
        TComponentProps['fromReduxDispatch']
    >,
    TState extends DefaultRootState = DefaultRootState,
    TDispatch extends Dispatch = Dispatch
>(
    connectorProperties: ReduxConnectorProperties<TComponentProps, TState, TDispatch>
) => {
    return connect(connectorProperties.mapStateToProps, connectorProperties.mapDispatchToProps);
};
