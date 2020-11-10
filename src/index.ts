import { PropsWithChildren } from 'react';
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
    [fromParent]: PropsWithChildren<TPropsFromParent>;
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

export type ReduxLinkProperties<
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
            ? undefined
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

const getReduxLink = <
    TComponentProps extends ReduxComposedProps<
        TComponentProps['fromParent'],
        TComponentProps['fromReduxState'],
        TComponentProps['fromReduxDispatch']
    >,
    TState extends DefaultRootState = DefaultRootState,
    TDispatch extends Dispatch = Dispatch
>(
    linkProperties: ReduxLinkProperties<TComponentProps, TState, TDispatch>
) => {
    return connect<
        TComponentProps['fromReduxState'],
        TComponentProps['fromReduxDispatch'],
        TComponentProps['fromParent'],
        TState
    >(
        linkProperties && linkProperties.mapStateToProps,
        linkProperties && linkProperties.mapDispatchToProps
    );
};

export const link = <
    TComponentProps extends ReduxComposedProps<
        TComponentProps['fromParent'],
        TComponentProps['fromReduxState'],
        TComponentProps['fromReduxDispatch']
    >,
    TState extends DefaultRootState = DefaultRootState,
    TDispatch extends Dispatch = Dispatch,
    TReactComponent extends React.FC = React.FC<TComponentProps['all']>
>(
    component: TReactComponent,
    linkProperties: ReduxLinkProperties<TComponentProps, TState, TDispatch>
) => {
    return getReduxLink(linkProperties)(component);
};

export const getTypedLink = <
    TState extends DefaultRootState = DefaultRootState,
    TDispatch extends Dispatch = Dispatch
>() =>
    function <
        TComponentProps extends ReduxComposedProps<
            TComponentProps['fromParent'],
            TComponentProps['fromReduxState'],
            TComponentProps['fromReduxDispatch']
        >,
        TReactComponent extends React.FC = React.FC<TComponentProps['all']>
    >(
        component: TReactComponent,
        linkProperties: ReduxLinkProperties<TComponentProps, TState, TDispatch>
    ) {
        return link<TComponentProps, TState, TDispatch>(component, linkProperties);
    };
