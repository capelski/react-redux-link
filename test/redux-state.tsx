import React from 'react';
import { getReduxConnector, ReduxComposedProps } from '../src/index';

type ComponentProps = ReduxComposedProps<
    {
        fromParent: string;
    },
    {
        fromReduxState: string;
    }
>;

const Component: React.FC<ComponentProps['all']> = (props) => (
    <div>
        {props.fromParent} - {props.fromReduxState}
    </div>
);

const ConnectedComponent = getReduxConnector<ComponentProps>({
    mapStateToProps: (_state, ownProps) => ({ fromReduxState: ownProps.fromParent })
})(Component);

const ParentComponent: React.FC = () => (
    <div>
        <Component fromParent={'test'} fromReduxState={'test'} />
        <ConnectedComponent />
        {/* TODO This should:
        - Complain about missing fromParent
        - Don't request fromReduxState */}
    </div>
);

console.log(ParentComponent({}));
