# COSC 499 Capstone Project



## Client

### Install

```bash
npm install -g yarn
npm install --global expo-cli

cd client
yarn install
```

### Usage

```
yarn start
```

This will start the expo server and will print a QR code to the console. If you have the Expo app on your device, you can scan the QR code with your camera and open the link that appears to test the app.

Depending on how your network is setup, this may not work. In that case you can use tunnel mode. It’s a bit slower but should solve any network issues.

```
npm install -g localtunnel

yarn start --tunnel
```

To test the app on other platforms, like on the browser or an emulator:

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

