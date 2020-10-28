import React from 'react';
import { connector, ReduxComposedProps } from '../src/index';

type ComponentProps = ReduxComposedProps<{
    fromParent: string;
}>;

const Component: React.FC<ComponentProps['all']> = (props) => <div>{props.fromParent}</div>;

const ConnectedComponent = connector<ComponentProps>(Component, undefined);

export const ParentComponent: React.FC = () => (
    <div>
        <Component fromParent={'test'} />
        <ConnectedComponent fromParent={'test'} />

        {/* Following cases should raise typescript errors:
        - Missing property from parent
        - Invalid property */}

        {/* <ConnectedComponent /> 
        <ConnectedComponent asd={3} /> */}
    </div>
);

// Following calls should raise typescript errors

// connector<ComponentProps>(Component); // Missing second argument
// connector<ComponentProps>(Component, {}); // Invalid second argument
