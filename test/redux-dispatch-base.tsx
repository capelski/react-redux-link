import React from 'react';
import { link, ReduxComposedProps } from '../src/index';

export type ComponentProps = ReduxComposedProps<
    {
        fromParent: string;
    },
    undefined,
    {
        fromReduxDispatch: (_parameter: string) => void;
    }
>;

export const Component: React.FC<ComponentProps['all']> = (props) => (
    <div>
        {props.fromParent} - {props.fromReduxDispatch}
    </div>
);

export const ConnectedComponent = link<ComponentProps>(Component, {
    mapDispatchToProps: (_dispatch, ownProps) => ({
        fromReduxDispatch: (_parameter: string) => {
            console.log(ownProps.fromParent);
        }
    })
});
