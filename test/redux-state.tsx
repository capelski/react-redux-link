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

export const ParentComponent: React.FC = () => (
    <div>
        <Component fromParent={'test'} fromReduxState={'test'} />
        <ConnectedComponent fromParent={'test'} />

        {/* Following cases should raise typescript errors:
        - Missing property from parent
        - Providing a connect property
        - Invalid property */}

        {/* <ConnectedComponent /> 
        <ConnectedComponent fromParent={'test'} fromReduxState={'test'} />
        <ConnectedComponent asd={3} /> */}
    </div>
);
