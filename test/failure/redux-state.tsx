import React from 'react';
import { link } from '../../src/index';
import { Component, ComponentProps, ConnectedComponent } from '../redux-state-base';

export const ParentComponent: React.FC = () => (
    <div>
        {/* Missing property from parent */}
        <ConnectedComponent />
        {/* Providing a connect property */}
        <ConnectedComponent fromParent={'test'} fromReduxState={'test'} />
        {/* Invalid property */}
        <ConnectedComponent asd={3} />
    </div>
);

link<ComponentProps>(Component); // Missing argument

link<ComponentProps>(Component, {}); // Invalid second argument

link<ComponentProps>(Component, {
    // Invalid mapStateToProps return type
    mapStateToProps: (_dispatch, _ownProps) => ({})
});

link<ComponentProps>(Component, {
    // Invalid mapDispatchToProps argument
    mapDispatchToProps: (_dispatch, ownProps) => ({
        fromReduxDispatch: (_parameter: string) => {
            console.log(ownProps.fromParent);
        }
    }),
    mapStateToProps: (_state, ownProps) => ({
        fromReduxState: ownProps.fromParent
    })
});
