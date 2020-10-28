import React from 'react';
import { linker } from '../../src/index';
import { Component, ComponentProps, ConnectedComponent } from '../redux-less-base';

export const ParentComponent: React.FC = () => (
    <div>
        {/* Missing property from parent */}
        <ConnectedComponent />
        {/* Invalid property */}
        <ConnectedComponent asd={3} />
    </div>
);

linker<ComponentProps>(Component); // Missing second argument
linker<ComponentProps>(Component, {}); // Invalid second argument
