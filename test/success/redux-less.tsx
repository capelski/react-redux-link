import React from 'react';
import { Component, ConnectedComponent } from '../redux-less-base';

export const ParentComponent: React.FC = () => (
    <div>
        <Component fromParent={'test'} />
        <ConnectedComponent fromParent={'test'} />
    </div>
);
