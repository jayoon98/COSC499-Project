import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Modal,
  Linking,
  ScrollView,
} from 'react-native';
import { Navigation, Button, Title, Header } from '../common/Core';
import { Colors } from '../colors';
import { Button as NativeButton, Alert } from 'react-native';
import { _Picker, DomainPicker } from '../common/Picker';



export function Contact() {
    return (
      <Navigation selected="contact">
         <View>
        <Text style= {styles.header}> Contact Information</Text>
        <Button
                style={styles.card}
                type="none"
                onPress={() => {
                  Alert.alert(
                    'Contact Crisis Line',
                    'If you are experiencing a mental health crisis, you can call a crisis line for support',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Yes',
                        onPress: () => Linking.openURL('tel: 1-800-784-2433'),
                      },
                    ],
                  );
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>Call Crisis Line </Text>
              </Button>

              <Button
              style={styles.card}
              type="none"
              onPress={() => {
                Alert.alert(
                  'Would you like to visit the BC Crisis Centre website?',
                  '',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => Linking.openURL('https://crisiscentre.bc.ca'),
                    },
                  ],
                );
              }}
            >
              <Text>BC Crisis Centre </Text>
            </Button>

            <Button
              style={styles.card}
              type="none"
              onPress={() => {
                Alert.alert(
                  'Would you like to send an email to Dr. Dawson ?',
                  '',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => Linking.openURL('mailto:info@dawsonpsychologicalservices.com?subject=Contact: Health Circles App&body= '),
                    },
                  ],
                );
              }}
            >
              <Text>Email Dr. Dawson </Text>
            </Button>
              
          </View>
      </Navigation> 
      )};
  

const styles = StyleSheet.create({
  header:{
    fontSize:25,
    padding: 70,
    marginLeft: 15
    
  },
  card: {
    padding: 18,
    borderRadius: 14,
    margin: 12,
    marginTop: 0,
    backgroundColor: Colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5.6,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
});
