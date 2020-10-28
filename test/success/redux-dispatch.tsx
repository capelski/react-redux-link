import React from 'react';
import { Component, ConnectedComponent } from '../redux-dispatch-base';

export const ParentComponent: React.FC = () => (
    <div>
        <Component fromParent={'test'} fromReduxDispatch={() => {}} />
        <ConnectedComponent fromParent={'test'} />
    </div>
);
