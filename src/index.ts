import { connect, DefaultRootState } from 'react-redux';
import { Dispatch } from 'redux';

const fromParent = 'fromParent';
const fromReduxState = 'fromReduxState';
const fromReduxDispatch = 'fromReduxDispatch';

export interface ReduxComposedProps<
    TPropsFromParent = undefined,
    TPropsFromReduxState = undefined,
    TPropsFromReduxDispatch = undefined
> {
    [fromParent]: TPropsFromParent;
    [fromReduxState]: TPropsFromReduxState;
    [fromReduxDispatch]: TPropsFromReduxDispatch;
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
    [fromReduxState]: infer TComponentState;
    [fromReduxDispatch]: infer TComponentDispatch;
}
    ? TComponentState extends undefined
        ? TComponentDispatch extends undefined
            ?
                  | {
                        mapStateToProps?: undefined;
                        mapDispatchToProps?: undefined;
                    }
                  | undefined
            : {
                  mapStateToProps?: undefined;
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
              mapDispatchToProps?: undefined;
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
    : undefined;

type ReduxDispatchMapper<TDispatch, TPropsFromParent, TPropsFromReduxDispatch> = (
    dispatch: TDispatch,
    propsFromParent: TPropsFromParent
) => TPropsFromReduxDispatch;

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
    connectorProperties?: ReduxConnectorProperties<TComponentProps, TState, TDispatch>
) => {
    return connect(
        connectorProperties && connectorProperties.mapStateToProps,
        connectorProperties && connectorProperties.mapDispatchToProps
    );
};

export const connector = <
    TComponentProps extends ReduxComposedProps<
        TComponentProps['fromParent'],
        TComponentProps['fromReduxState'],
        TComponentProps['fromReduxDispatch']
    >,
    TReactComponent extends React.FC, // TODO Provide react component properties generic type
    TState extends DefaultRootState = DefaultRootState,
    TDispatch extends Dispatch = Dispatch
>(
    component: TReactComponent,
    connectorProperties?: ReduxConnectorProperties<TComponentProps, TState, TDispatch>
) => {
    return connect(
        connectorProperties && connectorProperties.mapStateToProps,
        connectorProperties && connectorProperties.mapDispatchToProps
    )(component);
};
