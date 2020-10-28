import React from 'react';
import { Component, ConnectedComponent } from '../redux-state-dispatch-base';

export const ParentComponent: React.FC = () => (
    <div>
        <Component fromParent={'test'} fromReduxDispatch={() => {}} fromReduxState={'test'} />
        <ConnectedComponent fromParent={'test'} />
    </div>
);
