import React from 'react';
import { link } from '../../src/index';
import { Component, ComponentProps, ConnectedComponent } from '../redux-less-base';

export const ParentComponent: React.FC = () => (
    <div>
        {/* Missing property from parent */}
        <ConnectedComponent />
        {/* Invalid property */}
        <ConnectedComponent asd={3} />
    </div>
);

link<ComponentProps>(Component); // Missing second argument
link<ComponentProps>(Component, {}); // Invalid second argument
