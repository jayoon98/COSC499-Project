# Tech Stack Considerations - Front-end

Decision: ReactNative

## Android Studio (Mobile)

Android Studio is the default way of building applications for Android. Apps would be developed within the Android Studio IDE and compiled to Android packages.

**PROS:**

- Group is experencied with Android app develepment.

- Provides a true native experience on Android with a native look and feel.

- Better performance on Android than the alternatives.

**CONS:**

- Only supports one platform, porting to iOS would be cumbersome.
- Java is not as flexible as JavaScript/TypeScript which could slow down development.
- More difficult to design nice looking interfaces compared to React which allows for much more customization for UI components.

## ReactJS (Web)

React is a front end UI library for JavaScript developed by Facebook. React is developed using JavaScript or TypeScript + HTML and CSS.

**PROS:**

- Currently the most popular front end we framework backed by a large community of users, meaning lots of resources (libraries, tutorials, etc.) are available.
- Simplifies UI code by separating UI elements into components which can be reused.
- Availability of component libraries like Ant Design, which includes many pre-made components to speed up prototyping.

**CONS:**

- Team has less experience with React compared to Android code.
- JavaScript is arguably more prone to errors compared to Java since it doesn’t have any compile time checks (this is mostly solved by TypeScript).
- Web is probably not the ideal platform given our requirements.

## React Native (Mobile + Web)

React Native is mostly identical to ReactJS, but it replaces HTML+CSS with abstracted components which are implemented differently depending on whether the app is running on iOS, Android or Web. This abstraction  allows us to write the code once and deploy it anywhere.

React Native is developed using JavaScript or TypeScript and is compiled to iOS apps, Android packages, or Web.

**PROS:**

- Largely identical API to ReactJS, meaning learning resources designed for ReactJS also apply to React Native.
- Supports mutliple platmorms (iOS, Android and Web).
- Allows for more customizabilty than true native mobile frameworks.

**CONS:**

- On mobile, React apps won’t feel as native as using Android Studio for Android and Swift/Objective C for iOS.
- Generally has more ‘bloat’ than a native application since it requires a JavaScript engine to be installed along side the app.
- Team has no experience with React Native.

# Tech Stack Considerations - Back-end

Decision: Express

## Express (NodeJS) + MongoDB

Express is the standard web framework for NodeJS. It is widely used by large tech companies.

**PROS:**

- Very modern and easy to use API. Similar APIs have been added to other languages due to the popularity of express.
- Scales very well with multiple NodeJS instances.
- Uses JavaScript/TypeScript which compliments our front-end tech stack.
- MongoDB uses json for storing data which interfaces nicely with JavaScript since json is designed to be used with JavaScript.

**CONS:**

- Not as fast as web frameworks available for compiled languages (369,533 requests per second). This can be mitigated by using multiple NodeJS processes.

## Flask (Python) + MariaDB

Flask is minimalistic Python micro web framework. It provides only the bare minimum for a web framework, everything else (such as database layers or form validation) must be done using third party libraries.

**PROS:**

- Minimalistic nature of Flask means the API is very well thought out and easy to pick up.
- Does not come with any extra ‘bloat’ which keeps the backend lightweight.

**CONS:**

- Very slow throughput (number of requests per second) compared to other web frameworks, though it is among the fastest Python frameworks (83,398 requests per second).
- Large Python codebases are difficult to maintain.

## Fiber (Go) + MariaDB

Fiber is a small web framework written using `fasthttp` in Go. It is designed to be similar to Express (NodeJS).

**PROS:**

- Flexible and very modern API.
- Based on `fasthttp` meaning Fiber is among the fastest web frameworks available (6,566,971 requests per second).

**CONS:**

- Go is not as easy to learn as Python or JavaScript.
- Does not complement our frontend tech stack as nicely as Express.

*Performance metrics from [techempower benchmarks](https://www.techempower.com/benchmarks/#section=data-r19&hw=ph&test=composite&a=2).*





