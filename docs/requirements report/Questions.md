# Q&A

> How will you ensure that tests are sufficient to show the code works as intended.

For our backend, we will write tests for each API route. This will ensure that all paths exposed to the user are tested. For the frontend, most of the code will likely consist of UI code, where testing the UI visually is more feasible.



> - Not a single member of the team had an Android device? Heck, I'm not even mad, thats amazing. Did you consider flutter?
> - Did you consider using Flutter for the project since it also works on iOS and Android? What are you doing to ensure that your app follows the BC Personal Information Protection Act?

We did consider using Flutter, however learning a completely new programming language (Dart) could slow down development. Unlike Flutter, React is also widely used in Web applications, which would make porting our app to the web almost trivial.

For the second question, our client has mentioned that they will be consulting a lawyer to ensure our app follows the constraints of the BC Personal Information Protection Act. We will use test data, no real client/patient data while building the app and it will be the clients responsibility to ensure privacy laws are followed for his deployment.



> - I noticed you mentioned data being "saved locally" - are you planning on updating this at any point to save data externally, i.e. have the database be running on an external server before the project deadline? Or are you only focusing on local data storage?
> - When you say "data will be saved locally," is this only at this stage with a database being set up on a server at a later date?

We will be doing both. We will save the data locally and only upload data that the user has given permission for. Saving the data locally also ensures our app can be used offline, once online the app can synchronize with our server.



> Since you're using React Native, why not add support for more than just mobile devices? Does this add significant amounts of work (in your opinion, i.e. style and HCI components)? Did I just answer my own question?

Technically there’s no reason why we couldn’t support other devices aside from the fact that a mobile app does not always look great when it is just copy pasted into a desktop/web app, due to the things you have mentioned. Having components be designed for specific screen sizes generally yields something that looks and feels nicer.



> Will you be collecting and storing any data other than the data from the surveys that the users fill out? Or will the recommended activities be determined solely by the surveys?

We will likely record basic app usage data to give our client an idea of app engagement and usage by the users. The recommendations will be mainly determined by the results from the surveys. We are still discussing with our client on other things that can be added to improve the recommendations. 



> - Could you explain how the algorithm will be formatted for how the exercises are decided?
> - How is the algorithm for interpreting survey results being developed?
> - Are the actions that are recommended based on survey results decided automatically or manually?

Recommendations for activities are decided based on the result from the user surveys. These surveys focus on Dr. Dawson’s 5 key aspects of health. Each survey question is tagged with particular keywords, we look for the tags which the user is struggling with (low score on question) and suggest activities that match those tags. For a trivial example say a user enters a low score for the question “do you exercise often?”, the app might suggest exercises that the user can do.



> How will you be testing on Android if none of the users have an Android device?

We will still test on Android devices closer to our milestone deadlines by borrowing these devices. However React Native will look identical on both iOS and Android so we do not need to test on Android very often.



> Do you anticipate any issues with using a multi-platform mobile framework (React Native)?

Not really. Of course we expect some amount of issues in deployment but we expect native code would also have similar issues. ReactNative is used by mobile applications with large user bases (such as Discord) so it is a tried and tested technology.



> Do people need to sign up to use the service if they are a general user?

Users will not be forced to register, but they will need to sign up if they want to be identified in the server. Say a user was to change mobile device at somepoint, they would need a login to identify them selves and keep their previous data. As well, if they are a patient of our client, they will need to register to agree to share information with him.



> - Can users choose to retake the questionnaire if they feel needed?
> - Will users be able to fill out the questionnaire multiple times depending on if their needs change so that the activities will be updated?

Yes they can! In fact, the app will be designed to remind users to update domains on a regular basis. 



> - In your tech stack what backend will you be using to handle the data?
> - What kind of backend data storage will be used?
> - Does your application require any backend systems or database connections? What frameworks and technologies are you using for this area?

We will be using Express (NodeJS) as our backend web framework. For our database, for now we decided to use MongoDB. Though we are also considering a SQL database like MariaDB. We will finalize the database decision after the Peer testing #1 dealine, as that is when we will start working on the server. By then it should be clear how the front-end should access the data which should make the database choice more obvious.



> Why did you choose mocha over Jest?

Both frameworks are very similar. Jest is probably more popular right now since it is backed by Facebook. Mocha is nice because it relies on other libraries for assertions, so you are not limited to Jest’s ‘behaviour’ style assertions (like `expect(value).toBe(0)` versus `assert.eq(0, value)`). The differences are very minor though, both are very good test frameworks.



> How will you go from survey answers to health circles. has this system already been created?

This is still being actively discussed with our client. He has provided a basic scoring system where the radius of the circle will be relative to the score in the domain, so a high scored domain has a large circle. 



> What sort of useful feedback will the app give the user?

The app suggests activities that the user can do to improve in key aspects of their health.



> How does your app UI fit in different screen sizes?

ReactNative components use styles very similar to CSS on the web. Meaning features designed to make pages responsive such as Flex Box are supported. We will only support mobile devices, which limits the range of screensizes we need to support.



> How do you plan on debugging the application if the developers don't have access to the raw user data?

We will use mock data during development and for debugging. We will not need access to real user data when debugging the app.



> How are you going to test 100+ simultaneous users using your app?

Since we are using NodeJS for our backend, we can scale up easily depending on traffic by launching more instances of the server.



> - When you say modern iOS and Android, which devices and versions will be considered as modern?
> -  Do the code for both Android and IOS stay the same? Is there version requirements for the Android and IOS phones?

Android: 6.0 (Marshmallow) or newer. iOS: 10.0 or newer. The code for either stays the same unless we want to implement some component that uses a functionality only available on a certain device.



> - What kind of information will be shared between clients/patients and their health care professional? Will it be entirely anonymized data, or will a client be able to share answers directly with their psychologist?
> - Is the data shared between client and doctor be anonymous?

Dr. Dawson's actual patients will be able to agree to share full info with him, anybody else will be anonymized. The anonymous data is used in aggregate in Dr. Dawson’s research.



> What is the higher level of access that patients would receive over general users?

Patients have the option to share the data directly with Dr. Dawson.



> What criteria will be used to develop the questionnaire(how are questions formulated to ensure their proper functionality and purpose)?

The questionaries are provided by Dr. Dawson as he is the expert in this area.



> How do these "circles" function?

This is a work in progress for us but right now we show each colour coded domain as a circle with a common centre point. The radius of the circle is relative to the score achieved in that domain questionnaire.
