# Testing

### Unit Tests

For testing system level features, that is features not including visible UI components, we are using unit testing in combination with continuous integration. To achieve this, we are using the Mocha unit testing library. This testing framework was chosen as it is one of the most popular unit testing frameworks for our chosen tech stack (TypeScript and React). Another popular framework that was considered is Jest, however Mocha is a more customizable as it is a modular framework. Unit tests are designed to run in isolation of the rest of the application, so we will be using mocking to procedurally generate input data for the code that we are testing. Using mocks for the data ensures we can cover as many test cases as possibles.

### UI Testing

For the interactive user interface aspect of our application which is cannot be tested using unit testing, we will be using the Expo framework for React Native. Expo allows us to visualize in real time any changes made to the code on a mobile device. This means that in we can quickly test new UI functionality on the actual target device. As our code base grows, we may also use Storyblocks, which is a way to test UI components in isolation. Once Storyblocks is setup, we can test specific components without running the rest of the application, allowing the UI to be tested in isolation.

### Continuous Integration

For regression testing, we are using GitHub actions as a way to setup continuous integration to ensure new code does not break previous functionality. In our setup, whenever someone opens a pull request to add more functionality to our code base, a GitHub action will run all of the unit tests automatically before the pull request is allowed to be merged with our main branch. GitHub actions have templates that support our chosen tech stack, and it is integrated with GitHub which is where our code base is hosted.

