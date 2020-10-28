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

const ConnectedComponent = connector<ComponentProps>(Component, {
    mapDispatchToProps: (_dispatch, ownProps) => ({
        fromReduxDispatch: (_parameter: string) => {
            console.log(ownProps.fromParent);
        }
    }),
    mapStateToProps: (_state, ownProps) => ({
        fromReduxState: ownProps.fromParent
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
        />
        <ConnectedComponent
            fromParent={'test'}
            fromReduxState={'test'}
        />
        <ConnectedComponent asd={3} /> */}
    </div>
);

// Following calls should raise typescript errors

// connector<ComponentProps>(Component); // Missing argument

// connector<ComponentProps>(Component, {}); // Invalid second argument

// connector<ComponentProps>(Component, {
//     // Invalid second argument
//     mapDispatchToProps: (_dispatch, ownProps) => ({
//         fromReduxDispatch: (_parameter: string) => {
//             console.log(ownProps.fromParent);
//         }
//     })
// });

// connector<ComponentProps>(Component, {
//     // Invalid second argument
//     mapStateToProps: (_state, ownProps) => ({
//         fromReduxState: ownProps.fromParent
//     })
// });

// connector<ComponentProps>(Component, {
//     // Invalid mapDispatchToProps return type
//     mapDispatchToProps: (_dispatch, _ownProps) => ({}),
//     mapStateToProps: (_state, ownProps) => ({
//         fromReduxState: ownProps.fromParent
//     })
// });

// connector<ComponentProps>(Component, {
//     mapDispatchToProps: (_dispatch, ownProps) => ({
//         fromReduxDispatch: (_parameter: string) => {
//             console.log(ownProps.fromParent);
//         }
//     }),
//     // Invalid mapStateToProps return type
//     mapStateToProps: (_state, _ownProps) => ({})
// });
