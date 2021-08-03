import React, { useState, useEffect } from 'react';
import { Navigation, Header } from '../common/Core';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
//chart view
import { BarChart } from 'react-native-chart-kit';
// theme to set domain colors 
import { ThemeContext } from '../common/ThemeContext';

// function to get date from string and check if it is within the last 15 days
import { customStringToDate } from '../services/customLocalDate';

//props -- getting the data passed from Report
export type ReportDetailsProps = {
  item: any;
};



export function ReportDetails(props: ReportDetailsProps) {
  const [item, setItem] = useState(props.item);


  // data for chart - useState will listen to any changes in this data and update it in the view 
  const [data, setData] = useState({
    // labels for chart horizontal line
    labels: ['Social', 'Emotional', 'Physical', 'Mentl', 'Spiritual'],
    // values for data , 
    datasets: [
      // initial fake values
      {
        data: [0, 0, 0, 0, 0],
      },
    ],
  });

  // function to calculate verage value of each domain's answers 
  const average = (array: Array<number>) => {

    if (array.length > 0) {
      let sum: number = array.reduce((previous, current) => current += previous);
      let avg = sum / array.length;


      return avg
    } else { return 0  }


  }

  // useEffect  updates the view when it finishes 
  useEffect(() => {
    // array to hold all questions 
    const questions = []

    //arrays to hold answers values from each domain
    const social = []
    const emotional = []
    const physical = []
    const mental = []
    const spiritual = []

    // in firebase, surveys hold the data of te user's answers 
    const surveys: Object = item.surveys

    // we need to iterate through surveys and get the ones that are complete .. 
    if(surveys!=null){
    Object.values(surveys).forEach(element => {

      //console.log(element.completed);
      // if the survey is finished 
      if (element.completed) {
        // only if the survey is within the last two weeks : 
        if (customStringToDate(element.date)) {
            //add all questions in this survey to the questions array
            questions.push(element.questions)
        }
      }

    });}
    //if we have questions ---- this is redundant  if the survey is complete we do have questions in the database 
    if (questions.length > 0) {


      questions.forEach(q => {

        // I use Object.values to get the data of question 
        
        let question = Object.values(q)

        // find the domain and add the answer in the relevant array 

        question.forEach(que => {
          switch (que.domain) {
            case 'social': {
              social.push(que.response)


              break;
            }
            case 'emotional': {
              emotional.push(que.response)

              break;
            }
            case 'physical': {
              physical.push(que.response)

              break;
            }
            case 'mental': {
              mental.push(que.response)

              break;
            }
            case 'spiritual': {
              spiritual.push(que.response)


              break;
            }

          }

        })
      })



      const data2 = {
        labels: ['Social', 'Emotional', 'Physical', 'Mental', 'Spiritual'],
        datasets: [
          {
            data: [average(social), average(emotional), average(physical), average(mental), average(spiritual)],
          },
        ],

      }

      setData(data2)

    }
  }, []);


  return (
    <Navigation>
      <View style={styles.container}>
        <Header title="Report Details"></Header>
        <View style={styles.mainContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}></View>
          </View>

          <View style={{ flex: 1, paddingTop: 10 }}>
            <View style={styles.textView}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  {'Basic Info: '}
                </Text>
              </View>

            </View>

            <View style={styles.textView}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                  {'Name: '}
                </Text>
              </View>
              <View>
                <Text>{item.name}</Text>
              </View>
            </View>

            <View style={styles.textView}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                  {'Register date: '}
                </Text>
              </View>
              <View>
                <Text>{item.registerDate || "--"}</Text>
              </View>
            </View>

            <View style={styles.textView}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                  {'Age: '}
                </Text>
              </View>
              <View>
                <Text>{item.age || "--"}</Text>
              </View>
            </View>

            <View style={styles.textView}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                  {'Gender: '}
                </Text>
              </View>
              <View>
                <Text>{item.gender || "--"}</Text>
              </View>
            </View>
          </View>
        </View>
        <ThemeContext.Consumer>
          {(theme) => (
            <View
              style={{
                width: '100%',
              }}
            >
              <View style={styles.chipContainer}>
                <View style={{ ...styles.chip, backgroundColor: theme.theme['social'] }}>
                  <Text>{'Social'}</Text>
                </View>
                <View style={{ ...styles.chip, backgroundColor: theme.theme['emotional'] }}>
                  <Text>{'Emotional'}</Text>
                </View>
                <View style={{ ...styles.chip, backgroundColor: theme.theme['physical'] }}>
                  <Text>{'Physical'}</Text>
                </View>
                <View style={{ ...styles.chip, backgroundColor: theme.theme['mental'] }}>
                  <Text>{'Mental'}</Text>
                </View>
                <View style={{ ...styles.chip, backgroundColor: theme.theme['spiritual'] }}>
                  <Text>{'Spiritual'}</Text>
                </View>
              </View>

              <BarChart
                style={{
                  marginVertical: 8,
                  marginHorizontal: 16,
                  borderRadius: 30,
                  borderWidth: 1
                }}
                data={data}
                width={Dimensions.get('window').width - 34}
                height={250}
                fromZero={true}
                yAxisInterval={1}
                segments={4}
                withInnerLines={false}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0, // optional, defaults to 2dp

                  color: (opacity = 1) => `#000`,
                  style: {
                    // borderRadius: 16,
                  },
                }}
              />
            </View>
          )}
        </ThemeContext.Consumer>
      </View>
    </Navigation>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    width: '40%',
  },
  chipContainer: {
    // borderWidth: 1,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  chip: {

    paddingHorizontal: 5,
    paddingVertical: 5,
    marginRight: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  textView: {
    flexDirection: 'row',
  },
  avatar: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 50,
  },
  mainContainer: {
    // borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
  },
  entityContainer: {
    marginTop: 16,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  entityText: {
    fontSize: 20,
    color: '#333333',
  },
  listContainer: {
    marginTop: 20,
    padding: 20,
  },
  container: {
    height: '100%',
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
    minWidth: '50%',
    textAlign: 'center',
  },
});
