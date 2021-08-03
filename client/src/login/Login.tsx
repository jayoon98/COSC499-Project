import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, StatusBar,Linking,KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { Colors } from '../colors';
import { Button, Header } from '../common/Core';
import { createUser, signInUser, resetPassword } from '../services/login';
import Logo from '../common/Logo';

export const MAIN_SCENE = 'questionnaires';
export const TUTORIAL = 'tos';

export function ResetPassword(props: { email: string }) {
  const [email, setEmail] = useState(props.email);
  const [loading, setLoading] = useState(false);

  const enterEmail = () => {
    if (loading) return;

    if (!email) {
      Alert.alert('Error', 'Missing required fields');
      return;
    }
    setLoading(true);

    resetPassword(email, (err) => {
      if (err) {
        Alert.alert('Error', err.message);
        return;
      }
    });
  };
  return (
  
    <View>
      
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.container}>
        <Header title="health circles" />
        <TextInput
          style={styles.input}
          placeholder="email"
          onChangeText={setEmail}
          value={email}
          autoCompleteType="email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <View style={styles.actions}>
          <Button
            type="primary"
            disabled={loading}
            style={styles.button}
            onPress={enterEmail}
          >
            <Text style={{ color: 'white' }}>Send a password reset email</Text>
          </Button>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <Text>Remembered your password?</Text>
          <Button type="none" onPress={() => Actions.pop()}>
            <Text style={{ color: 'cornflowerblue' }}>Sign In</Text>
          </Button>
        </View>
      </View>
    </View>
    
  );
}

export function Signup(props: { email: string }) {
  const [userName, setName] = useState('');
  const [email, setEmail] = useState(props.email);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const createAccount = () => {
    if (loading) return;

    if (!email || !password || !userName) {
      Alert.alert('Error', 'Missing required fields');
      return;
    }
    setLoading(true);

    createUser({ email, name: userName }, password, (err) => {
      if (err) {
        // Possible error codes:
        //  auth/email-already-in-use
        //  auth/invalid-email
        //  auth/operation-not-allowed
        //  auth/weak-password
        Alert.alert('Error', err.message);
        console.error(err);
        setLoading(false);
        return;
      }

      signInUser(email, password, (res, err) => {
        setLoading(false);
        if (res && !err) {
          Actions.replace(TUTORIAL);
          return;
        }
        // This should not happen unless the user loses connection
        console.error(err);
      });
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
    <View style={styles.container}>
      <Logo />
      <Header title="health circles" />

      <TextInput
        style={{ ...styles.input, marginTop: 32 }}
        placeholder="name"
        onChangeText={setName}
        value={userName}
      />
      <TextInput
        style={styles.input}
        placeholder="email"
        onChangeText={setEmail}
        value={email}
        autoCompleteType="email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        onChangeText={setPassword}
        value={password}
        autoCompleteType="password"
        autoCapitalize="none"
        secureTextEntry
      />

      <View style={styles.actions}>
        <Button
          type="primary"
          disabled={loading}
          style={styles.button}
          onPress={createAccount}
        >
          <Text style={{ color: 'white' }}>Create Account</Text>
        </Button>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 24,
        }}
      >
        <Text>Already have an account?</Text>
        <Button type="none" onPress={() => Actions.pop()}>
          <Text style={{ color: 'cornflowerblue' }}>Sign In</Text>
        </Button>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (loading) return;

    if (!email || !password) {
      Alert.alert('Error', 'Missing required fields');
      return;
    }
    setLoading(true);

    signInUser(email, password, (res, err) => {
      setLoading(false);
      if (res && !err) {
        Actions.replace(MAIN_SCENE);
        return;
      }
      // Possible error codes:
      //  auth/invalid-email
      //  auth/user-disabled
      //  auth/user-not-found
      //  auth/wrong-password
      Alert.alert('Invalid Login', err.message);
      console.error(err);
    });
  };

  const signup = () => {
    if (!loading) {
      // Send the email in case the user already started typing in the
      // signin page, that way they don't have to do it again.
      Actions.push('signup', { email });
    }
  };

  const resetpassword = () => {
    if (!loading) {
      // Send the email in case the user already started typing in the
      // signin page, that way they don't have to do it again.
      Actions.push('resetpassword', { email });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'position'}
      style={{ flex: 1 }}>
    <View style={styles.container}>
      <Logo />
      <Header title="health circles"></Header>
      {/* <Header title="health circles" /> */}

      <TextInput
        style={{ ...styles.input, marginTop: 32 }}
        placeholder="email"
        onChangeText={setEmail}
        value={email}
        autoCompleteType="email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        onChangeText={setPassword}
        value={password}
        autoCompleteType="password"
        autoCapitalize="none"
        secureTextEntry
      />

      <View style={styles.actions}>
        <Button
          type="primary"
          disabled={loading}
          style={styles.button}
          onPress={login}
        >
          <Text style={{ color: 'white' }}>Sign In</Text>
        </Button>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 24,
        }}
      >
        <Text>First time here?</Text>
        <Button type="none" onPress={signup}>
          <Text style={{ color: 'cornflowerblue' }}>Sign Up</Text>
        </Button>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Text>Forgot your password?</Text>
        <Button type="none" onPress={resetpassword}>
          <Text style={{ color: 'cornflowerblue' }}>Reset Password</Text>
        </Button>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 2,
        }}
      >
        <Button type="none" onPress={ ()=>{ Linking.openURL('https://www.psychologicalhealth.life')}} >
          <Text style={{ color: 'crimson' }}>Rewards and Directions Along Your Road to Wellness</Text>
        </Button>
      </View>

    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    marginTop: 50,
    padding: 48,
  },

  input: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.offwhite,
    width: '100%',
    padding: 12,
  },

  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },

  button: {
    display: 'flex',
    flexBasis: 'auto',
    flexGrow: 1,
    flexShrink: 1,
  },
});
