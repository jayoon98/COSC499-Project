# Accessing Themes

```typescript
import { ThemeContext } from '../common/ThemeContext';
```

wrap any components that need to access the theme:

```typescript
<ThemeContext.Consumer> {theme => (
//your components here
)}
```

`theme` is a data structure with key value pairs, where the keys are physical, social, emotional, mental, spiritual and the values are the hexadecimal colour.

```typescript
<Title style={{color: theme[physical]}}>
```

Alternatively to wrapping components in `<ThemeContext.Consumer>`, you should be able to access the theme as a constant within a function:

```typescript
const t = useContext(ThemeContext);
t[physical]; //#5350ef for theme1
```

# Context API

## Context Object

Creates a Context object. Components that subscribe to this Context object will read their current context value from the closest matching `Provider` above it in the tree.

The `defaultValue` argument is only used when the component does not have a Provider above it in the tree.

```typescript
const MyContext = React.createContext(defaultValue);
```

> In our case, the default value will be light and colour theme 1.

## Provider

The Provider component accepts a `value` prop to be passed to components that are descendents of this Provider. Providers can be nested to override values deeper within the tree. All consumers that are descendants of a Provider will re-render whenever the `value` changes.

```typescript
<MyContext.Provider value={/* some value*/}>
```

> Selecting a theme will setState to the corresponding colour values. The Provider will read the state for its value.

## Consumer

The Consumer component lets you subscribe to context changes within a function component. The `value` argument will be equal to the closest Provider for this context above in the tree (or `defaultValue` if there is no Provider).

```typescript
<MyContext.Consumer> {value => /* render something based on the context value */} </MyContext.Consumer>
```

## Updating Context from a Nested Component

You can pass a function down through the context to allow consumers to update the context.

```typescript
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
```

## useContext

This hook accepts a context object and returns the current value for that context. The value is determined by the `value` prop of the nearest `<MyContext.Provider>` above the component in the tree. This lets you read values from the context, but not write them.

```typescript
const value = useContext(MyContext);
```

Note: the argument must be the context object, not MyContext.Consumer or MyContext.value

This is equivalent to `static contextType = MyContext` (used only in classes, not functional components) or to `<MyContext.Consumer>`.

# Notifications

```typescript
import * as Notifications from 'expo-notifications';

// First, set the handler that will cause the notification
// to show the alert

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Second, call the method
// this returns a `Promise` resolving with the notification's identifier once the notification is successfully scheduled for immediate display.
Notifications.scheduleNotificationAsync({
  content: {
    title: 'Look at that notification',
    body: "I'm so proud of myself!",
  },
  trigger: null,
});
```

### Trigger Examples

Scheduling the notification that will trigger once, at the beginning of next hour

```typescript
const trigger = new Date(Date.now() + 60 * 60 * 1000);
trigger.setMinutes(0);
trigger.setSeconds(0);
```

Scheduling the notification that will trigger repeatedly, every 20 minutes

```typescript
trigger: {
    seconds: 60 * 20,
    repeats: true
  }
```
