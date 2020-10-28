import React from 'react';
import { connector, ReduxComposedProps } from '../src/index';

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

const ConnectedComponent = connector<ComponentProps>(Component, {
    mapDispatchToProps: (_dispatch, ownProps) => ({
        fromReduxDispatch: (_parameter: string) => {
            console.log(ownProps.fromParent);
        }
    })
});

export const ParentComponent: React.FC = () => (
    <div>
        <Component fromParent={'test'} fromReduxDispatch={() => {}} />
        <ConnectedComponent fromParent={'test'} />

        {/* Following cases should raise typescript errors:
        - Missing property from parent
        - Providing a connect property
        - Invalid property */}

        {/* <ConnectedComponent />
        <ConnectedComponent fromParent={'test'} fromReduxDispatch={() => {}} />
        <ConnectedComponent asd={3} /> */}
    </div>
);

// Following calls should raise typescript errors

// connector<ComponentProps>(Component); // Missing argument

// connector<ComponentProps>(Component, {}); // Invalid second argument

// connector<ComponentProps>(Component, {
//     // Invalid mapDispatchToProps return type
//     mapDispatchToProps: (_dispatch, _ownProps) => ({})
// });

// connector<ComponentProps>(Component, {
//     mapDispatchToProps: (_dispatch, ownProps) => ({
//         fromReduxDispatch: (_parameter: string) => {
//             console.log(ownProps.fromParent);
//         }
//     }),
//     // Invalid mapStateToProps argument
//     mapStateToProps: (_state, ownProps) => ({
//         fromReduxState: ownProps.fromParent
//     })
// });
