# react-redux-link

Utility to type check component properties when connecting a react component to the [redux](https://www.npmjs.com/package/redux) store

## Usage

You need to replace the [react-redux](https://www.npmjs.com/package/react-redux) `connect` call with `link` and declare the component properties through `ReduxComposedProps` type. `ReduxComposedProps` takes up to three generic arguments, all of them optional:

1. Properties injected to the component by the **parent**
2. Properties injected to the component from the **redux state**
3. Properties injected to the component using **redux dispatch**

Example: connect using **mapStateToProps**

```tsx
import React from 'react';
import { link, ReduxComposedProps } from 'react-redux-link';
// ...

type MyComponentProps = ReduxComposedProps<
    {
        // Properties injected from the parent component
        fromParent: string;
    },
    {
        // Properties mapped from the redux state
        fromState: string;
    }
>;

const MyComponent: React.FC<MyComponentProps['all']> = (props) => (/*...*/);

export const ConnectedComponent = link<MyComponentProps /*, TState, TDispatch*/>(Component, {
    mapStateToProps: (state, propsFromParent) => ({
        fromState: '...'
    })
});
```

Note that `link` method takes the redux state and dispatch types as optional generic parameters (TState and TDispatch). These parameters are then used to infer the type of the `state` and `dispatch` arguments in the `mapStateToProps` and `mapDispatchToProps` functions respectively. When they are not provided, they will default to `DefaultRootState` (type from [@types/react-redux](https://www.npmjs.com/package/@types/react-redux)) and `Dispatch<AnyAction>` (type from [redux](https://www.npmjs.com/package/redux)).

You can avoid having to provide the generic parameters on every `link` call by generating a custom typed `link` function. For example:

```tsx
import { getTypedLink } from 'react-redux-link';
import { Dispatch } from './dispatch';
import { State } from './state';

export const typedLink = getTypedLink<State, Dispatch>();
```

## More examples

Connect using **mapStateToProps** and **mapDispatchToProps**:

```tsx
import React from 'react';
import { link, ReduxComposedProps } from 'react-redux-link';
// ...

type MyComponentProps = ReduxComposedProps<
    {
        // Properties injected from the parent component
        fromParent: string;
    },
    {
        // Properties mapped from the redux state
        fromState: string;
    },
    {
        // Properties mapped using redux dispatch
        fromDispatch: () => void;
    }
>;

const MyComponent: React.FC<MyComponentProps['all']> = (props) => (/*...*/);

export const ConnectedComponent = link<MyComponentProps /*, TState, TDispatch*/>(Component, {
    mapStateToProps: (state, propsFromParent) => ({
        fromState: '...'
    }),
    mapDispatchToProps: (dispatch, propsFromParent) => ({
        fromDispatch: () => {
            /* ... */
        }
    })
});
```

Connect using **mapDispatchToProps**:

```tsx
import React from 'react';
import { link, ReduxComposedProps } from 'react-redux-link';
// ...

type MyComponentProps = ReduxComposedProps<
    {
        // Properties injected from the parent component
        fromParent: string;
    },
    undefined
    {
        // Properties mapped using redux dispatch
        fromDispatch: () => void;
    }
>;

const MyComponent: React.FC<MyComponentProps['all']> = (props) => (/*...*/);

export const ConnectedComponent = link<MyComponentProps /*, TState, TDispatch*/>(Component, {
    mapDispatchToProps: (dispatch, propsFromParent) => ({
        fromDispatch: () => {
            /* ... */
        }
    })
});
```

Connect **without mapping**. `react-redux-link` supports this case for sake of usage simplicity, although it doesn't make sense to connect a component to the redux store if it doesn't need to map any property:

```tsx
import React from 'react';
import { link, ReduxComposedProps } from 'react-redux-link';
// ...

type MyComponentProps = ReduxComposedProps<{
    // Properties injected from the parent component
    fromParent: string;
}>;

const MyComponent: React.FC<MyComponentProps['all']> = (props) => (/*...*/);

export const ConnectedComponent = link<MyComponentProps /*, TState, TDispatch*/>(
    Component,
    undefined
);
```

## Motivation

Every time I add [redux](https://www.npmjs.com/package/redux) to a React+Typescript project I struggle to add type checks on the components `connect` call (from [react-redux](https://www.npmjs.com/package/react-redux)). What I usually end up doing is creating separate interfaces for each component, grouping the properties based on the its origin: provided from the **parent** component, provided from the redux **state** or provided using redux **dispatch**. The resulting components look something like this:

```tsx
import React from 'react';
import { connect } from 'react-redux';
// ...

interface PropsFromParent {
    fromParent: string;
    // ...
    // Properties injected from the parent component
}

interface PropsFromState {
    fromState: string;
    // ...
    // Properties mapped from the redux state
}

interface PropsFromDispatch {
    fromDispatch: () => void;
    // ...
    // Properties mapped using redux dispatch
}

type ComponentProps = PropsFromParent & PropsFromState & PropsFromDispatch;

const Component: React.FC<ComponentProps> = (props) => <div>{/*...*/}</div>;

export const ConnectedComponent = connect(
    (state, propsFromParent): PropsFromState => ({ fromState: '...' }),
    (dispatch, propsFromParent): PropsFromDispatch => ({
        fromDispatch: () => {
            /* ... */
        }
    })
)(Component);
```

I encounter two problems with this approach:

-   For each component, **multiple interfaces** (up to 3) and a union type must be declared
-   The `connect` method provides **no type safety**. Not only will accept as arguments mapping functions that return the wrong type, it will also accept being called without mapping functions at all, leaving the undefined property errors to be found at runtime

`react-redux-link` is designed to resolved these two issues through the following two principles:

-   Providing a single type to contain the separated interfaces: **ReduxComposedProps**. They will still exist under the hood, but the component developer doesn't need to declare them
-   Providing a more descriptive `connect` method which checks the `connect` mappings' types: **link**. It just monkey patches `connect`, but makes sure the component developer isn't missing any property

Using `link` instead of `connect` will raise typescript errors if a required mapping function isn't provided or if the provided functions doesn't return the expected types. Here is what the same component above would look like by using `react-redux-link`:

```tsx
import React from 'react';
import { link, ReduxComposedProps } from 'react-redux-link';
// ...

type ComponentProps = ReduxComposedProps<
    {
        fromParent: string;
        // ...
        // Properties injected from the parent component
    },
    {
        fromState: string;
        // ...
        // Properties mapped from the redux state
    },
    {
        fromDispatch: () => void;
        // ...
        // Properties mapped using redux dispatch
    }
>;

const Component: React.FC<ComponentProps['all']> = (props) => <div>{/*...*/}</div>;

export const ConnectedComponent = link<ComponentProps>(Component, {
    mapStateToProps: (state, propsFromParent) => ({
        fromState: '...'
    }),
    mapDispatchToProps: (dispatch, propsFromParent) => ({
        fromDispatch: () => {
            /* ... */
        }
    })
});
```
