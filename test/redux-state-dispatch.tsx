import React from 'react';
import { connector, ReduxComposedProps } from '../src/index';

type ComponentProps = ReduxComposedProps<
    {
        fromParent: string;
    },
    {
        fromReduxState: string;
    },
    {
        fromReduxDispatch: (_parameter: string) => void;
    }
>;

const Component: React.FC<ComponentProps['all']> = (props) => (
    <div>
        {props.fromParent} - {props.fromReduxState} - {props.fromReduxDispatch}
    </div>
);

const ConnectedComponent = connector<ComponentProps, React.FC<ComponentProps['all']>>(Component, {
    mapStateToProps: (_state, ownProps) => ({
        fromReduxState: ownProps.fromParent
    }),
    mapDispatchToProps: (_dispatch, ownProps) => ({
        fromReduxDispatch: (_parameter: string) => {
            console.log(ownProps.fromParent);
        }
    })
});

export const ParentComponent: React.FC = () => (
    <div>
        <Component fromParent={'test'} fromReduxDispatch={() => {}} fromReduxState={'test'} />
        <ConnectedComponent fromParent={'test'} />

        {/* Following cases should raise typescript errors:
        - Missing property from parent
        - Providing a connect property
        - Invalid property */}

        {/* <ConnectedComponent />
        <ConnectedComponent
            fromParent={'test'}
            fromReduxDispatch={() => {}}
            fromReduxState={'test'}
        />
        <ConnectedComponent asd={3} /> */}
    </div>
);
