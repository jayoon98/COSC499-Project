import React, { useState, useEffect } from 'react';
import { Navigation, Header } from '../common/Core';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
} from 'react-native';
//chart view
import { BarChart } from 'react-native-chart-kit';
// theme to set domain colors
import { ThemeContext } from '../common/ThemeContext';
import firebase from 'firebase';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// function to get date from string and check if it is within the last 15 days
import { customStringToDate } from '../services/customLocalDate';

//props -- getting the data passed from Report
export type ReportDetailsProps = {
	item: any;
};

const TableView = ({ item, theme }) => {
  const { weekly: arr, avg, qs, domain } = item;
  const tableCellStyle = {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    // borderColor: theme[domain],
    borderColor: 'darkgrey',
  };

  return (
    <View style={{ paddingHorizontal: 10, marginVertical: 10 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: theme[domain],
          marginBottom: 5,
        }}
      >{`Question: ${qs}`}</Text>

      <View style={{ flexDirection: 'row' }}>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>S</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>M</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>T</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>W</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>T</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>F</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>S</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>Avg</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>{arr[0] || '-'}</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>{arr[1] || '-'}</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>{arr[2] || '-'}</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>{arr[3] || '-'}</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>{arr[4] || '-'}</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>{arr[5] || '-'}</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>{arr[6] || '-'}</Text>
        </View>
        <View style={tableCellStyle}>
          <Text style={{ fontWeight: 'bold' }}>{avg || '-'}</Text>
        </View>
      </View>
    </View>
  );
};

const opacityVal = 0.4;
export function ReportDetails(props: ReportDetailsProps) {
  const [item, setItem] = useState(props.item);
  // array to hold all questions
  const [questions, setQuestions] = useState([]);
  //arrays to hold answers values from each domain
  const [highlighted, setHighlighted] = useState('averages');
  const [timeHighlighted, setTimeHighlighted] = useState('week');
  const [fetchedQs, setFetchedQs] = useState();
  const [qsAns, setQsAns] = useState([]);
  const [once, setOnce] = useState(1);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQsIndex, setSelectedQsIndex] = useState(0);

  // data for chart - useState will listen to any changes in this data and update it in the view
  const [data, setData] = useState({
    // labels for chart horizontal line
    labels: ['Social', 'Emotional', 'Physical', 'Mental', 'Spiritual'],
    // values for data ,
    datasets: [
      // initial fake values
      {
        data: [0, 0, 0, 0, 0],
      },
    ],
  });

  // useEffect  updates the view when it finishes
  useEffect(() => {
    if (once) {
      getData(14, 'averages');
      fetchQuestions();
      setOnce(0);
    }
    getQsAns('all');
  }, [fetchedQs]);

  const solveDate = (date, type) => {
    var d = new Date(date.split('T')[0]);

    // if (type == 'day') return d.toString().split(' ')[0];
    if (type == 'day') return d.getDay();
    else if (type == 'date') return d.getDate();
    else if (type == 'month') return d.getMonth();
  };

  // function to calculate verage value of each domain's answers
  const average = (array: Array<number>) => {
    if (array.length > 0) {
      let sum = 0;

      for (let i = 0; i < array.length; i++) sum += array[i].response;

      let avg = sum / array.length;
      return avg;
    } else {
      return 0;
    }
  };

  const getData = (timeLimit, type) => {
    const surveys: Object = item.surveys;
    let ques = [];
    let temp = [];
    let soc = [];
    let emo = [];
    let phy = [];
    let spi = [];
    let men = [];

    // need to iterate through surveys and get the ones that are complete ..
    if (surveys != null) {
      Object.values(surveys).forEach((element) => {
        // if the survey is finished
        if (element.completed) {
          // only if the survey is within the last two weeks :
          if (customStringToDate(element.date, timeLimit)) {
            //add all questions in this survey to the questions array
            ques.push({ questions: element.questions, date: element.date });
            // temp.push({ ...element.questions, date: element.date });
          }
        }
      });
      setQuestions(ques);
    }

    //if we have questions ---- this is redundant  if the survey is complete we do have questions in the database
    if (ques.length) {
      ques.forEach((q) => {
        // use Object.values to get the data of question
        let question = Object.values(q.questions);

        // find the domain and add the answer in the relevant array
        question.forEach((que) => {
          switch (que.domain) {
            case 'social': {
              soc.push({ response: que.response, date: q.date });
              break;
            }
            case 'emotional': {
              emo.push({ response: que.response, date: q.date });
              break;
            }
            case 'physical': {
              phy.push({ response: que.response, date: q.date });
              break;
            }
            case 'mental': {
              men.push({ response: que.response, date: q.date });
              break;
            }
            case 'spiritual': {
              spi.push({ response: que.response, date: q.date });
              break;
            }
          }
        });
      });
    }

    if (type == 'averages') {
      let data2 = {
        labels: ['Social', 'Emotional', 'Physical', 'Mental', 'Spiritual'],
        datasets: [
          {
            data: [
              average(soc),
              average(emo),
              average(phy),
              average(men),
              average(spi),
            ],
          },
        ],
      };
      setData(data2);
    } else if (type == 'social') displaydata(soc, timeLimit);
    else if (type == 'emotional') displaydata(emo, timeLimit);
    else if (type == 'physical') displaydata(phy, timeLimit);
    else if (type == 'mental') displaydata(men, timeLimit);
    else if (type == 'spiritual') displaydata(spi, timeLimit);
  };

  //dataset for barchart to be used after processing chart data from firebase
  const displaydata = (domainarray: any[], timeLimit) => {
    let data = [];
    let labels = [];
    let count = [];
    let date;

    switch (timeLimit) {
      case 8: {
        labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        data = [0, 0, 0, 0, 0, 0, 0];
        count = [0, 0, 0, 0, 0, 0, 0];

        for (let i = 0; i < domainarray.length; i++) {
          date = solveDate(domainarray[i].date, 'day');
          data[date] += domainarray[i].response;
          count[date]++;
        }

        break;
      }
      case 32: {
        for (let i = 1; i < 32; i++) {
          data[i] = 0;
          count[i] = 0;
        }

        labels = [
          1,
          '',
          '--',
          '',
          5,
          '',
          '--',
          '',
          10,
          '',
          '--',
          '',
          15,
          '',
          '--',
          '',
          20,
          '',
          '--',
          '',
          25,
          '',
          '--',
          '',
          30,
        ];

        for (let i = 0; i < domainarray.length; i++) {
          date = solveDate(domainarray[i].date, 'date');
          data[date] += domainarray[i].response;
          count[date]++;
        }

        break;
      }
      case 366: {
        labels = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        for (let i = 1; i < 12; i++) {
          data[i] = 0;
          count[i] = 0;
        }

        for (let i = 0; i < domainarray.length; i++) {
          date = solveDate(domainarray[i].date, 'month');
          data[date] += domainarray[i].response;
          count[date]++;
        }

        break;
      }
    }

    for (let i = 0; i < data.length; i++)
      if (data[i]) data[i] = data[i] / count[i];
    for (let i = 0; i < data.length; i++) if (data[i] == undefined) data[i] = 0;

    setData({
      labels: labels,
      datasets: [
        {
          data: data,
        },
      ],
    });
  };

  const fetchQuestions = () => {
    firebase
      .database()
      .ref()
      .child('questions')
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) setFetchedQs(snapshot.val());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getQsAns = (type) => {
    let temp = [];

    for (let i = 0; i < questions.length; i++) {
      for (let j in questions[i].questions) {
        Object.values(fetchedQs).forEach((cat) => {
          if (
            (type == 'all' && cat[j] !== undefined) ||
            (questions[i].questions[j].domain == type && cat[j] !== undefined)
          ) {
            temp.push({
              qs: cat[j].description,
              ans: questions[i].questions[j].response,
              domain: questions[i].questions[j].domain,
              date: questions[i].date,
              key: j,
            });
          }
        });
      }
    }
    setQsAns(temp);

    let cat = {};
    for (let i = 0; i < temp.length; i++) {
      if (cat[temp[i].qs] == undefined) {
        cat[temp[i].qs] = {
          domain: temp[i].domain,
          qs: temp[i].qs,
          questions: [temp[i]],
        };
      } else {
        cat[temp[i].qs].questions.push(temp[i]);
      }
    }

    let temp2 = [];
    let sum;
    let index = 0;
    Object.values(cat).forEach((value) => {
      temp2 = [0, 0, 0, 0, 0, 0, 0];
      sum = 0;
      for (let i = 0; i < value.questions.length; i++) {
        let qs = value.questions[i];
        temp2[solveDate(qs.date, 'day')] += qs.ans;
        sum += qs.ans;
      }
      value.weekly = temp2;
      value.avg = (sum / value.questions.length).toFixed(1);
      value.index = index++;
    });

    let temp3 = [];
    Object.values(cat).forEach((value) => temp3.push(value));
    setCategories(temp3);
  };

  const createExcel = async () => {
    const item = props.item;

    const social = Object.values(qsAns).filter(
      (value) => value.domain == 'social',
    );
    const emotional = Object.values(qsAns).filter(
      (value) => value.domain == 'emotional',
    );
    const physical = Object.values(qsAns).filter(
      (value) => value.domain == 'physical',
    );
    const mental = Object.values(qsAns).filter(
      (value) => value.domain == 'mental',
    );
    const spiritual = Object.values(qsAns).filter(
      (value) => value.domain == 'spiritual',
    );

    let data = [];
    for (let i = 0; i < qsAns.length; i++) {
      data.push({
        UserInfo:
          i == 0
            ? item.name
            : i == 1
            ? item.email
            : i == 2 && item.gender != undefined
            ? item.gender
            : i == 3 && item.age != undefined
            ? item.age
            : '',

        SocialQuestion: social.length > i ? social[i].qs : '',
        SocialResponse: social.length > i ? social[i].ans : '',

        EmotionalQuestion: emotional.length > i ? emotional[i].qs : '',
        EmotionalResponse: emotional.length > i ? emotional[i].ans : '',

        PhysicalQuestion: physical.length > i ? physical[i].qs : '',
        PhysicalResponse: physical.length > i ? physical[i].ans : '',

        MentalQuestion: mental.length > i ? mental[i].qs : '',
        MentalResponse: mental.length > i ? mental[i].ans : '',

        SpiritualQuestion: spiritual.length > i ? spiritual[i].qs : '',
        SpiritualResponse: spiritual.length > i ? spiritual[i].ans : '',
      });
    }

    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cities');
    const wbout = XLSX.write(wb, {
      type: 'base64',
      bookType: 'xlsx',
    });

    const uri = FileSystem.cacheDirectory + `${item.name}_report.xlsx`;
    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri, {
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'MyWater data',
      UTI: 'com.microsoft.excel.xlsx',
    });
  };

  return (
    <Navigation>
      <ScrollView>
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
                  <Text>{item.registerDate || '--'}</Text>
                </View>
              </View>

              <View style={styles.textView}>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    {'Age: '}
                  </Text>
                </View>
                <View>
                  <Text>{item.age || '--'}</Text>
                </View>
              </View>

              <View style={styles.textView}>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    {'Gender: '}
                  </Text>
                </View>
                <View>
                  <Text>{item.gender || '--'}</Text>
                </View>
              </View>
            </View>
          </View>
          <ThemeContext.Consumer>
            {(theme) => (
              <>
                <View
                  style={{
                    width: '100%',
                  }}
                >
                  <View style={styles.chipContainer}>
                    <View
                      style={{
                        ...styles.chip,
                        opacity: highlighted == 'averages' ? 1 : opacityVal,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setHighlighted('averages');
                          setTimeHighlighted('week');
                          getData(8, 'averages');
                          getQsAns('all');
                        }}
                      >
                        <Text>{'Averages'}</Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        ...styles.chip,
                        borderColor: highlighted == 'social' ? 'white' : null,
                        opacity: highlighted == 'social' ? 1 : opacityVal,
                        backgroundColor: theme.theme['social'],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setHighlighted('social');
                          setTimeHighlighted('week');
                          getData(8, 'social');
                          getQsAns('social');
                        }}
                      >
                        <Text
                          style={{
                            color: highlighted == 'social' ? 'white' : 'black',
                          }}
                        >
                          {'Social'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        ...styles.chip,
                        borderColor:
                          highlighted == 'emotional' ? 'white' : null,
                        opacity: highlighted == 'emotional' ? 1 : opacityVal,
                        backgroundColor: theme.theme['emotional'],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setHighlighted('emotional');
                          setTimeHighlighted('week');
                          getData(8, 'emotional');
                          getQsAns('emotional');
                        }}
                      >
                        <Text
                          style={{
                            color:
                              highlighted == 'emotional' ? 'white' : 'black',
                          }}
                        >
                          {'Emotional'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        ...styles.chip,
                        borderColor: highlighted == 'physical' ? 'white' : null,
                        opacity: highlighted == 'physical' ? 1 : opacityVal,
                        backgroundColor: theme.theme['physical'],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setHighlighted('physical');
                          setTimeHighlighted('week');
                          getData(8, 'physical');
                          getQsAns('physical');
                        }}
                      >
                        <Text
                          style={{
                            color:
                              highlighted == 'physical' ? 'white' : 'black',
                          }}
                        >
                          {'Physical'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        ...styles.chip,
                        borderColor: highlighted == 'mental' ? 'white' : null,
                        opacity: highlighted == 'mental' ? 1 : opacityVal,
                        backgroundColor: theme.theme['mental'],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setHighlighted('mental');
                          setTimeHighlighted('week');
                          getData(8, 'mental');
                          getQsAns('mental');
                        }}
                      >
                        <Text
                          style={{
                            color: highlighted == 'mental' ? 'white' : 'black',
                          }}
                        >
                          {'Mental'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        ...styles.chip,
                        borderColor:
                          highlighted == 'spiritual' ? 'white' : null,
                        opacity: highlighted == 'spiritual' ? 1 : opacityVal,
                        backgroundColor: theme.theme['spiritual'],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setHighlighted('spiritual');
                          setTimeHighlighted('week');
                          getData(8, 'spiritual');
                          getQsAns('spiritual');
                        }}
                      >
                        <Text
                          style={{
                            color:
                              highlighted == 'spiritual' ? 'white' : 'black',
                          }}
                        >
                          {'Spiritual'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Time duration buttons */}
                  <View style={[styles.chipContainer, { marginVertical: 10 }]}>
                    <View
                      style={{
                        ...styles.chip,
                        borderColor: timeHighlighted == 'week' ? 'white' : null,
                        opacity: timeHighlighted == 'week' ? 1 : opacityVal,
                        backgroundColor:
                          highlighted === 'averages'
                            ? '#918C8C'
                            : theme.theme[highlighted],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setTimeHighlighted('week');
                          getData(8, highlighted);
                        }}
                      >
                        <Text
                          style={{
                            color:
                              timeHighlighted == 'week' ? 'white' : 'black',
                          }}
                        >
                          {'Weekly'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        ...styles.chip,
                        borderColor:
                          timeHighlighted == 'month' ? 'white' : null,
                        opacity: timeHighlighted == 'month' ? 1 : opacityVal,
                        backgroundColor:
                          highlighted === 'averages'
                            ? '#918C8C'
                            : theme.theme[highlighted],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setTimeHighlighted('month');
                          getData(32, highlighted);
                        }}
                      >
                        <Text
                          style={{
                            color:
                              timeHighlighted == 'month' ? 'white' : 'black',
                          }}
                        >
                          {'Monthly'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        ...styles.chip,
                        borderColor: timeHighlighted == 'year' ? 'white' : null,
                        opacity: timeHighlighted == 'year' ? 1 : opacityVal,
                        backgroundColor:
                          highlighted === 'averages'
                            ? '#918C8C'
                            : theme.theme[highlighted],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setTimeHighlighted('year');
                          getData(366, highlighted);
                        }}
                      >
                        <Text
                          style={{
                            color:
                              timeHighlighted == 'year' ? 'white' : 'black',
                          }}
                        >
                          {'Annually'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <BarChart
                    style={{
                      // marginTop: 0,
                      marginHorizontal: 10,
                      borderRadius: 30,
                      borderWidth: 1,
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
                      barPercentage: highlighted == 'averages' ? 1 : 0.4,
                      labelColor: () => '#000',
                      color: () =>
                        highlighted == 'averages'
                          ? '#000'
                          : theme.theme[highlighted],
                      style: {
                        borderRadius: 16,
                      },
                    }}
                  />
                </View>

                <View
                  style={{
                    borderRadius: 5,
                    backgroundColor: 'dodgerblue',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 200,
                    height: 35,
                    alignSelf: 'center',
                    marginVertical: 15,
                    elevation: 7,
                  }}
                >
                  <TouchableOpacity onPress={createExcel}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      Export Excel
                    </Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.qs}
                  renderItem={({ item }) => (
                    <>
                      {timeHighlighted == 'week' && !isNaN(item.avg) ? (
                        <TableView item={item} theme={theme.theme} />
                      ) : !isNaN(item.avg) ? (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedQsIndex(item.index);
                            setModalVisible(true);
                          }}
                        >
                          <View
                            style={{
                              // backgroundColor: theme.theme[item.domain],
                              paddingHorizontal: 15,
                              paddingVertical: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                textAlign: 'justify',
                                color: theme.theme[item.domain],
                              }}
                            >
                              {`Question: ${item.qs}`}
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                textAlign: 'justify',
                              }}
                            >{`Response: : ${item.avg}`}</Text>
                          </View>
                        </TouchableOpacity>
                      ) : null}
                    </>
                  )}
                />
              </>
            )}
          </ThemeContext.Consumer>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {categories.length && (
          <View style={{ padding: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
              }}
            >
              <View>
                {selectedQsIndex > 0 && (
                  <TouchableOpacity
                    onPress={() => setSelectedQsIndex(selectedQsIndex - 1)}
                  >
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'dodgerblue',
                        fontSize: 16,
                      }}
                    >
                      {'<- Previous Question'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View>
                {selectedQsIndex < categories.length - 1 && (
                  <TouchableOpacity
                    onPress={() => setSelectedQsIndex(selectedQsIndex + 1)}
                  >
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'dodgerblue',
                        fontSize: 16,
                      }}
                    >
                      {'Next Question ->'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View
              style={{
                marginTop: 20,
                padding: 10,
                borderWidth: 1,
                borderColor: '#000',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'justify',
                }}
              >
                {`Question: ${categories[selectedQsIndex].qs}`}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: 'darkgrey',
                    padding: 10,
                  }}
                >
                  <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
                    Date
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: 'darkgrey',
                    padding: 10,
                  }}
                >
                  <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
                    Response
                  </Text>
                </View>
              </View>

              <FlatList
                data={categories[selectedQsIndex].questions}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: 'darkgrey',
                        padding: 10,
                      }}
                    >
                      <Text style={{ alignSelf: 'center' }}>
                        {item.date.split('T')[0]}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: 'darkgrey',
                        padding: 10,
                      }}
                    >
                      <Text style={{ alignSelf: 'center' }}>{item.ans}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        )}
      </Modal>
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
