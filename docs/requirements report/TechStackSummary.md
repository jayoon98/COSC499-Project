## Tech Stack Summary - Front-end

|                | PROS                                         | CONS                                   |
| -------------- | -------------------------------------------- | -------------------------------------- |
| Android Studio | Team more familiar with the API              | Only supports Android                  |
| React JS       | Easy to use, web apps are simpler to develop | Does not support mobile                |
| React Native   | Works on all target platforms                | Team has little experience with the AP |

We believe React Native + TypeScript is the best choice for our tech stack. Web apps are arguably simpler to develop and test, however given the functional requirements for the app we believe the app is best suited for Mobile. We believe Android studio is not a good option since we do not have a way to test Android apps on a device, in addition, limiting the app to be Android only could limit it’s outreach.

As for TypeScript versus JavaScript, both languages are supported by React, we believe TypeScript is a better option as TypeScript has been proven reduce programming errors as the codebase grows. TypeScript is not a large jump from JavaScript since JavaScript is also valid TypeScript.

## Tech Stack Summary - Back-end

|                            | PROS                                               | CONS                                |
| -------------------------- | -------------------------------------------------- | ----------------------------------- |
| Express (NodeJS) + MongoDB | Uses TypeScript just like our front-end tech stack | Not as fast as other web frameworks |
| Flask (Python) + MySQL     | Very minimal API making it easy to learn           | Difficult to scale                  |
| Fiber (Go) + MySQL         | One of the fastest web frameworks in the world     | Not easy to learn                   |

We are using Express as our backend with MongoDB as our database. Express provides a very flexible API while still being able to handle hundreds of thousands of requests per second. Fiber provides incredible performance, but this level of performance is only benefitial for very large tech companies in products that are beyond the scope of our project. Flask provides a very clean API, but there is little reason to prefer it over Express, since Express provides an API that is just as flexible. The main benefit of using express is that it can be used with TypeScript which is what our team is using for the frontend. For our database we have chosen MongoDB as it has great support in Express, though this is subject to change as the project evolves.  As mentioned in our milestone summary, we will be focusing on the application fronend for our Peer Testing #1 milestone, thus our backend is subject to change when we start working on it for Peer Testing #2