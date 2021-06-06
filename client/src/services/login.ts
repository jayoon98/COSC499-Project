import AsyncStorage from '@react-native-community/async-storage';
import { ErrorCallback, ResponseCallback, UserAccount } from './types';
import firebase from 'firebase';
import { Alert } from 'react-native';

const AUTH_USER_KEY = 'auth-user';

/**
 * Returns the cached authenticated user token. This way the user does not
 * neet to login every time, and the token is sent to the server instead.
 *
 * @param callback - Callback with the saved credential
 */
export function getCachedUserCredentials(
  callback: ResponseCallback<firebase.auth.UserCredential>,
): Promise<string> {
  return AsyncStorage.getItem(AUTH_USER_KEY, (err, res) => {
    if (err || !res) return callback(null, err);

    // Cached user login
    const { email, password } = JSON.parse(res);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((cred) => callback(cred, null))
      .catch((err) => callback(null, err));
  });
}

/**
 * Authenticates user with email and password. Creates a new user session
 *
 * @param email - User email that was used to create the account
 * @param password - User password
 * @param callback - Response with user credentials if the login was
 * successful or error message if it was not.
 */
export function signInUser(
  email: string,
  password: string,
  callback: ResponseCallback<firebase.auth.UserCredential>,
) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      const info = JSON.stringify({ email, password });
      AsyncStorage.setItem(AUTH_USER_KEY, info, (err) => callback(cred, err));
    })
    .catch((err) => callback(null, err));
}

/**
 * Creates a new user. The users email and password is added to the accounts
 * list and the user details is added to the users table in the database.
 *
 * @param user - The user account details
 * @param callback - Callback with any errors in saving the key
 */
export function createUser(
  user: UserAccount,
  password: string,
  callback: ErrorCallback,
) {
  // TODO: Maybe not ideal but it works, just store the login details to local
  // storage. Usually the way to do this is to create an session token on the server
  // and store that instead, but I haven't figured out how to do that with firebase.
  firebase
    .auth()
    .createUserWithEmailAndPassword(user.email, password)
    .then((cred) => {
      // Create record with user profile details.
      firebase
        .database()
        .ref(`users/${cred.user.uid}`)
        .set(user)
        .then((_) => {
          const info = JSON.stringify({ email: user.email, password });
          AsyncStorage.setItem(AUTH_USER_KEY, info, callback);
        })
        .catch(callback);
    })
    .catch(callback);
}

/**
 * Resets a user's password
 * @param email - User email that was used to create the account
 * @param callback
 */
export function resetPassword(email: string, callback: ErrorCallback) {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function () {
      Alert.alert(
        'Email sent',
        'Follow the instructions in the email to finish resetting your password',
      );
    })
    .catch(callback);
}
/**
 * Clears the cached user token.
 *
 * @param callback - Callback with any errors when removing the key
 */
export function clearCredentialsCache(callback: ErrorCallback): Promise<void> {
  return AsyncStorage.removeItem(AUTH_USER_KEY, callback);
}
