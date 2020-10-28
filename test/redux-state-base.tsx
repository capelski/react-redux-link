import React from 'react';
import { linker, ReduxComposedProps } from '../src/index';

export type ComponentProps = ReduxComposedProps<
    {
        fromParent: string;
    },
    {
        fromReduxState: string;
    }
>;

export const Component: React.FC<ComponentProps['all']> = (props) => (
    <div>
        {props.fromParent} - {props.fromReduxState}
    </div>
);

export const ConnectedComponent = linker<ComponentProps>(Component, {
    mapStateToProps: (_state, ownProps) => ({ fromReduxState: ownProps.fromParent })
});
