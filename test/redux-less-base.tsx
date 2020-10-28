import React from 'react';
import { linker, ReduxComposedProps } from '../src/index';

export type ComponentProps = ReduxComposedProps<{
    fromParent: string;
}>;

export const Component: React.FC<ComponentProps['all']> = (props) => <div>{props.fromParent}</div>;

export const ConnectedComponent = linker<ComponentProps>(Component, undefined);
