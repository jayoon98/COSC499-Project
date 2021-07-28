import React, { useState, useEffect } from 'react';
import { Navigation, Header, } from '../common/Core';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import { SearchBar } from 'react-native-elements'
export function Report() {
  const ref = firebase.database().ref(`users`);
  const [entityText, setEntityText] = useState('')
  const [entities, setEntities] = useState([])
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState(entities);

  useEffect(() => {
    const newEntities = []
    ref.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {

        var childData = childSnapshot.val();
        const entity = childData

        newEntities.push(entity)

      });
      setEntities(newEntities)
      setFilteredDataSource(newEntities)
    })
  }, []);

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = entities.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(entities);
      setSearch(text);
    }
  };


  const renderEntity = ({ item, index }) => {
    return (
      <View style={styles.entityContainer}>
        <Text style={styles.entityText}
          onPress={() =>
            Actions.push('reportdetails', { item: item })
          } >
          {index}. {item.name}

        </Text>
      </View>
    )
  }

  return (

    <Navigation>
      <View style={styles.container}>
        <Header title="Reports"></Header>

        {entities && (
          <View style={styles.listContainer}>
            <SearchBar
              lightTheme round
              searchIcon={{ size: 24 }}
              onChangeText={(text) => searchFilterFunction(text)}
              onClear={() => searchFilterFunction('')}
              placeholder="Type Here..."
              value={search}
            />
            <FlatList
              data={filteredDataSource}
              renderItem={renderEntity}
              keyExtractor={(item, index) => {
                return 'keu'+index;
              }}
              removeClippedSubviews={true}

            />
          </View>
        )}
      </View>
    </Navigation>

  );
}





const styles = StyleSheet.create({
  entityContainer: {
    marginTop: 16,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingBottom: 16
  },
  entityText: {
    fontSize: 20,
    color: '#333333'
  },
  listContainer: {
    marginTop: 20,
    padding: 20,
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'white',
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    height: 70,
    borderLeftWidth: 7,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6.6,
    elevation: 5,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  modalView: {
    height: '80%',
    width: '100%',
    display: 'flex',
    //justifyContent: 'space-between',
    //margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    //minHeight: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  reportItem: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',

  },
  reportText: {
    borderColor: '#afafaf',
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    minWidth: "50%",
    textAlign: "center"
  },
});
