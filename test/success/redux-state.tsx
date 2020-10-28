import React from 'react';
import { Component, ConnectedComponent } from '../redux-state-base';

export const ParentComponent: React.FC = () => (
    <div>
        <Component fromParent={'test'} fromReduxState={'test'} />
        <ConnectedComponent fromParent={'test'} />
    </div>
);
