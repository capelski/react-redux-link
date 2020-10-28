import React from 'react';
import { connector } from '../../src/index';
import { Component, ComponentProps, ConnectedComponent } from '../redux-dispatch-base';

export const ParentComponent: React.FC = () => (
    <div>
        {/* Missing property from parent */}
        <ConnectedComponent />
        {/* Providing a connect property */}
        <ConnectedComponent fromParent={'test'} fromReduxDispatch={() => {}} />
        {/* Invalid property */}
        <ConnectedComponent asd={3} />
    </div>
);

connector<ComponentProps>(Component); // Missing argument

connector<ComponentProps>(Component, {}); // Invalid second argument

connector<ComponentProps>(Component, {
    // Invalid mapDispatchToProps return type
    mapDispatchToProps: (_dispatch, _ownProps) => ({})
});

connector<ComponentProps>(Component, {
    mapDispatchToProps: (_dispatch, ownProps) => ({
        fromReduxDispatch: (_parameter: string) => {
            console.log(ownProps.fromParent);
        }
    }),
    // Invalid mapStateToProps argument
    mapStateToProps: (_state, ownProps) => ({
        fromReduxState: ownProps.fromParent
    })
});
