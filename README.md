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

npm install -g ts-node

yarn test
```
### Apk

```
open this link on a browser:

https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40nlttian/healthcircles-124c400274fa48098f75a72bbf1bac04-signed.apk

download and install apk file in an android emulator or device

This apk file is the version updated to August 19, 2021

to create a new apk :
expo build:android


```
