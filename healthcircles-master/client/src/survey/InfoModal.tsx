import React from 'react';
import { View, StyleSheet, Text, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '../common/Core';

export type InfoModalProps = {
  // Long description for a question
  description: string;
  visible?: boolean;
  onClose: () => void;
};

export function InfoModal({ description, visible, onClose }: InfoModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onDismiss={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalView}>
          <ScrollView>
            <Text style={{ fontSize: 20 }}>{description}</Text>
          </ScrollView>
          <Button onPress={onClose} style={{ width: '100%', marginTop: 20 }}>
            <Text>close</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    // 25% is the size of the header (doubled to use as margin)
    // +5% for exta margin.
    marginTop: '55%',
    justifyContent: 'center',
  },
  modalView: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 22,
    minHeight: 180,
    maxHeight: 500,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
