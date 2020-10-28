import React from 'react';
import { connector } from '../../src/index';
import { Component, ComponentProps, ConnectedComponent } from '../redux-less-base';

export const ParentComponent: React.FC = () => (
    <div>
        {/* Missing property from parent */}
        <ConnectedComponent />
        {/* Invalid property */}
        <ConnectedComponent asd={3} />
    </div>
);

connector<ComponentProps>(Component); // Missing second argument
connector<ComponentProps>(Component, {}); // Invalid second argument
