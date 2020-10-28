import React from 'react';
import { connector, ReduxComposedProps } from '../src/index';

export type ComponentProps = ReduxComposedProps<{
    fromParent: string;
}>;

export const Component: React.FC<ComponentProps['all']> = (props) => <div>{props.fromParent}</div>;

export const ConnectedComponent = connector<ComponentProps>(Component, undefined);
