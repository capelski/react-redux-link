import React from 'react';
import { connector } from '../../src/index';
import { Component, ComponentProps, ConnectedComponent } from '../redux-state-dispatch-base';

export const ParentComponent: React.FC = () => (
    <div>
        {/* Missing property from parent */}
        <ConnectedComponent />
        {/* Providing a connect property */}
        <ConnectedComponent fromParent={'test'} fromReduxDispatch={() => {}} />
        {/* Providing a connect property */}
        <ConnectedComponent fromParent={'test'} fromReduxState={'test'} />
        {/* Invalid property */}
        <ConnectedComponent asd={3} />
    </div>
);

connector<ComponentProps>(Component); // Missing argument

connector<ComponentProps>(Component, {}); // Invalid second argument

connector<ComponentProps>(Component, {
    // Invalid second argument
    mapDispatchToProps: (_dispatch, ownProps) => ({
        fromReduxDispatch: (_parameter: string) => {
            console.log(ownProps.fromParent);
        }
    })
});

connector<ComponentProps>(Component, {
    // Invalid second argument
    mapStateToProps: (_state, ownProps) => ({
        fromReduxState: ownProps.fromParent
    })
});

connector<ComponentProps>(Component, {
    // Invalid mapDispatchToProps return type
    mapDispatchToProps: (_dispatch, _ownProps) => ({}),
    mapStateToProps: (_state, ownProps) => ({
        fromReduxState: ownProps.fromParent
    })
});

connector<ComponentProps>(Component, {
    mapDispatchToProps: (_dispatch, ownProps) => ({
        fromReduxDispatch: (_parameter: string) => {
            console.log(ownProps.fromParent);
        }
    }),
    // Invalid mapStateToProps return type
    mapStateToProps: (_state, _ownProps) => ({})
});
