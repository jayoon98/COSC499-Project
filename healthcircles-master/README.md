# COSC 499 Capstone project



## Client

### Install

```bash
npm install -g expo-cli

cd client
yarn install
```

### Usage

```
yarn start
```

This will start the expo server and will print a QR code to the console. If you have the Expo app on your device, you can scan the QR code to test the app.

Depending on how your network is setup, this might not work. In that case you can use tunnel mode. It’s a bit slower but should solve any network issues.

```
npm install -g localtunnel

yarn start --tunnel
```

To test the app on other platforms, like on the browser or emulator:

```bash
yarn start --web      # Open a browser with the app
yarn start --ios      # Open in ios simulator
yarn start --android  # Open in Android emulator
```

### Testing

```
npm install -g mocha
npm install -g ts-node

yarn test
```

