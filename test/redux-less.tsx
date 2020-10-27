import React from 'react';
import { getReduxConnector, ReduxComposedProps } from '../src/index';

type ComponentProps = ReduxComposedProps<{
    fromParent: string;
}>;

const Component: React.FC<ComponentProps['all']> = (props) => <div>{props.fromParent}</div>;

const ConnectedComponent = getReduxConnector<ComponentProps>({})(Component);

const ParentComponent: React.FC = () => (
    <div>
        <Component fromParent={'test'} />
        <ConnectedComponent />
        {/* TODO This should:
        - Complain about missing fromParent */}
    </div>
);

console.log(ParentComponent({}));
