import React from 'react';
import { getReduxConnector, ReduxComposedProps } from '../src/index';

type ComponentProps = ReduxComposedProps<
    {
        fromParent: string;
    },
    undefined,
    {
        fromReduxDispatch: (_parameter: string) => void;
    }
>;

const Component: React.FC<ComponentProps['all']> = (props) => (
    <div>
        {props.fromParent} - {props.fromReduxDispatch}
    </div>
);

const ConnectedComponent = getReduxConnector<ComponentProps>({
    mapDispatchToProps: (_dispatch, ownProps) => ({
        fromReduxDispatch: (_parameter: string) => {
            console.log(ownProps.fromParent);
        }
    })
})(Component);

const ParentComponent: React.FC = () => (
    <div>
        <Component fromParent={'test'} fromReduxDispatch={() => {}} />
        <ConnectedComponent />
        {/* TODO This should:
        - Complain about missing fromParent
        - Don't request fromReduxDispatch */}
    </div>
);

console.log(ParentComponent({}));
