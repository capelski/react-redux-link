import React from 'react';
import { link, ReduxComposedProps } from '../src/index';

export type ComponentProps = ReduxComposedProps<{
    fromParent: string;
}>;

export const Component: React.FC<ComponentProps['all']> = (props) => <div>{props.fromParent}</div>;

export const ConnectedComponent = link<ComponentProps>(Component, undefined);
