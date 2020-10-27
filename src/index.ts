import { connect, DefaultRootState } from 'react-redux';
import { Dispatch } from 'redux';

export interface ReduxComposedProps<
    TExternal = undefined,
    TReduxState = undefined,
    TReduxDispatch = undefined
> {
    external: TExternal extends undefined ? ReduxComposedPropsNonApplicable : TExternal;
    reduxState: TReduxState extends undefined ? ReduxComposedPropsNonApplicable : TReduxState;
    reduxDispatch: TReduxDispatch extends undefined
        ? ReduxComposedPropsNonApplicable
        : TReduxDispatch;
    all: TExternal extends undefined
        ? TReduxState extends undefined
            ? TReduxDispatch extends undefined
                ? {}
                : TReduxDispatch
            : TReduxDispatch extends undefined
            ? TReduxState
            : TReduxState & TReduxDispatch
        : TReduxState extends undefined
        ? TReduxDispatch extends undefined
            ? TExternal
            : TExternal & TReduxDispatch
        : TReduxDispatch extends undefined
        ? TExternal & TReduxState
        : TExternal & TReduxState & TReduxDispatch;
}

export interface ReduxComposedPropsNonApplicable {
    __notProvided: never;
}

export type ReduxConnectorProperties<
    TComponentProps extends ReduxComposedProps<any, any, any>,
    TState,
    TDispatch
> = TComponentProps extends {
    reduxState: infer TComponentState;
    reduxDispatch: infer TComponentDispatch;
}
    ? TComponentState extends ReduxComposedPropsNonApplicable
        ? TComponentDispatch extends ReduxComposedPropsNonApplicable
            ? {}
            : { mapDispatchToProps: ReduxDispatchMapper<TComponentProps, TDispatch> }
        : TComponentDispatch extends ReduxComposedPropsNonApplicable
        ? { mapStateToProps: ReduxStateMapper<TComponentProps, TState> }
        : {
              mapStateToProps: ReduxStateMapper<TComponentProps, TState>;
              mapDispatchToProps: ReduxDispatchMapper<TComponentProps, TDispatch>;
          }
    : never;

type ReduxDispatchMapper<T extends ReduxComposedProps<any, any, any>, TDispatch> = (
    dispatch: TDispatch,
    ownProps: T['external']
) => T['reduxDispatch'];

type ReduxStateMapper<T extends ReduxComposedProps<any, any, any>, TState> = (
    state: TState,
    ownProps: T['external']
) => T['reduxState'];

export const getReduxConnector = <
    TComponentProps extends ReduxComposedProps<any, any, any>,
    TState = DefaultRootState,
    TDispatch = Dispatch
>(
    connectorProperties: ReduxConnectorProperties<TComponentProps, TState, TDispatch>
) => {
    return connect(
        ((connectorProperties as ReduxConnectorProperties<
            ReduxComposedProps<{}, {}, {}>,
            TState,
            TDispatch
        >).mapStateToProps as unknown) as ReduxStateMapper<TComponentProps, TState>,
        ((connectorProperties as ReduxConnectorProperties<
            ReduxComposedProps<{}, {}, {}>,
            TState,
            TDispatch
        >).mapDispatchToProps as unknown) as ReduxDispatchMapper<TComponentProps, TDispatch>
    );
};
