import React, { useState, useContext, useEffect, SetStateAction } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Modal,
} from 'react-native';
import { InfoModal } from '../survey/InfoModal';
import { domainInformation } from '../DomainInfo';
import { Actions } from 'react-native-router-flux';
import { ThemeContext, themes } from '../common/ThemeContext';
import { DomainAverages, getDomainScoreAverages } from '../services/survey';
import { Button } from '../common/Core';
import { Picker } from '@react-native-picker/picker';
import { customLocalDate, customLocalTime } from '../services/customLocalDate';
const domains = ['social', 'emotional', 'physical', 'mental', 'spiritual'];
const socialActivities = ['visit with a friend', 'call mom'];
const emotionalActivities = [
  'write in journal',
  "list 5 things I'm grateful for",
];
const physicalActivities = ['bedtime', 'yoga', 'go for a walk', 'stretch'];
const mentalActivities = ['meditate', 'practice mindfulness', 'deep breathing'];
const spiritualActivities = ['volunteer', 'connect with nature'];

const physicalPicker = physicalActivities.map((i) => (
  <Picker.Item label={i} value={i} key={i} />
));
const socialPicker = socialActivities.map((i) => (
  <Picker.Item label={i} value={i} key={i} />
));
const emotionalPicker = emotionalActivities.map((i) => (
  <Picker.Item label={i} value={i} key={i} />
));
const mentalPicker = mentalActivities.map((i) => (
  <Picker.Item label={i} value={i} key={i} />
));
const spiritualPicker = spiritualActivities.map((i) => (
  <Picker.Item label={i} value={i} key={i} />
));
const pickerItems = {
  social: socialPicker,
  emotional: emotionalPicker,
  physical: physicalPicker,
  mental: mentalPicker,
  spiritual: spiritualPicker,
};

const Colors = {
  offwhite: '#f2f6fa',
  lightgrey: '#e2e4ef',
};

const screen = Dimensions.get('screen');
const screenH = screen.height * screen.scale;

// What should be the default when there are no completed surveys?
const defaultScores = {
  social: 0,
  emotional: 0,
  physical: 0,
  mental: 0,
  spiritual: 0,
};

//helper to sort scores in decreasing order
function domainSort(domainScores: any): string[] {
  return Object.keys(domainScores).sort((a, b) => {
    return domainScores[b] - domainScores[a];
  });
}

type CircleScoreCardProps = {
  domain: string;
  onPress: (domain: string) => void;
  selected?: boolean;
  score: number;
};

function CircleScoreCard({
  domain,
  onPress,
  selected,
  score,
}: CircleScoreCardProps) {
  const style = selected
    ? { ...styles.domainCard, ...styles.domainCardSelected }
    : styles.domainCard;
  return (
    <TouchableOpacity
      onPress={() => onPress(domain)}
      style={{ width: '19.2%' }}
    >
      <ThemeContext.Consumer>
        {(theme) => (
          <View
            style={[
              style,
              { backgroundColor: theme.theme[domain] },
              { height: '100%' },
              domain == 'social' && { borderTopLeftRadius: 16 },
              domain == 'spiritual' && { borderTopRightRadius: 16 },
            ]}
          >
            <Text
              style={{
                fontSize: screen.height * 0.016,
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {domain} {'\n'} {score.toFixed(2)}
            </Text>
          </View>
        )}
      </ThemeContext.Consumer>
    </TouchableOpacity>
  );
}

type CircleProps = {
  domain: string;
  onPress: (domain: string) => void;
  selected?: boolean;
  domainScores: DomainAverages;
  domainSorted: string[];
};

//function to visualize overlapping circles
function Circles({ domain, onPress, domainScores, domainSorted }: CircleProps) {
  const size = screen.height * 0.21;
  const maxScore = Math.max(...Object.values(domainScores));
  const circle = Math.round((domainScores[domain] / maxScore) * size);

  const getTopOffset = (domain: string) => {
    if (domainSorted.indexOf(domain) == 0) return 0;
    else {
      const prevDomain = domainSorted.indexOf(domain) - 1;
      return (
        Math.round((domainScores[domainSorted[prevDomain]] / maxScore) * size) -
        Math.round((domainScores[domain] / maxScore) * size) * 0.5 +
        getTopOffset(domainSorted[prevDomain])
      );
    }
  };
  let topOffset = getTopOffset(domain);
  const leftOffset = size / 2 - circle / 2;

  return (
    <TouchableHighlight onPress={() => onPress(domain)}>
      <ThemeContext.Consumer>
        {(theme) => (
          <View
            style={{
              position: 'absolute',
              width: circle,
              height: circle,
              borderRadius: circle / 2,
              backgroundColor: theme.theme[domain],
              top: topOffset,
              left: leftOffset,
            }}
          />
        )}
      </ThemeContext.Consumer>
    </TouchableHighlight>
  );
}

export function CirclesVisual() {
  const [selected, setSelected] = useState({
    social: false,
    emotional: false,
    physical: false,
    mental: true,
    spiritual: false,
  });
  const [infoVisible, setInfoVisible] = useState(false);
  const [strategyVisible, setStrategyVisible] = useState(false);
  const [domainVisible, setDomainVisible] = useState(false);
  const [activityVisible, setActivityVisible] = useState(false);
  const [domainScores, setDomainScores] = useState(defaultScores);
  const [domainSorted, setDomainSorted] = useState(domainSort(defaultScores));

  const Item = Picker.Item as any;
  const [value, setValue] = React.useState('physical');
  const [activityValue, setActivityValue] = React.useState('New Activity');

  useEffect(() => {
    const fetchDomainScores = async () => {
      const responses = await getDomainScoreAverages(10);
      if (!responses) {
        // Use default
        return;
      }
      setDomainScores(responses);
      setDomainSorted(domainSort(responses));
    };
    fetchDomainScores();
  }, [setDomainScores, setDomainSorted]);

  //helper to highlight selected domain card/circle
  const selectDomain = (domain: string) => {
    const selectedCopy = {
      social: false,
      emotional: false,
      physical: false,
      mental: false,
      spiritual: false,
    };
    selectedCopy[domain] = true;
    setDomainSorted([...domainSort(domainScores), domain]);
    setSelected(selectedCopy);
  };

  //helper to return currently selected domain
  function returnSelectedDomain() {
    const id = Object.keys(selected);
    const active = id.filter(function (i) {
      return selected[i];
    });
    return active[0];
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        alignContent: 'center',
        margin: 0,
      }}
    >
      {/*Circles*/}
      <View
        style={{
          width: screen.height * 0.21,
          height: screen.height * 0.55,
          margin: screen.height * 0.01,
          alignSelf: 'center',
        }}
      >
        {domainSorted.every((d) => domainScores[d] === 0) ? (
          <View style={{ height: '100%' }}>
            <ThemeContext.Consumer>
              {(theme) => (
                <View
                  style={{
                    position: 'absolute',
                    width: Math.round(screen.height * 0.21),
                    height: Math.round(screen.height * 0.21),
                    borderRadius: Math.round(screen.height * 0.21) / 2,
                    backgroundColor: theme.theme[returnSelectedDomain()],
                    top: screen.height * 0.21,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: screen.height * 0.03,
                      color: 'white',
                    }}
                  >
                    Please{'\n'} take a {'\n'} HealthCircles {'\n'}survey{' '}
                  </Text>
                </View>
              )}
            </ThemeContext.Consumer>
          </View>
        ) : (
          domainSorted.map((d, i) => (
            <Circles
              key={i}
              selected={selected[d]}
              domain={d}
              onPress={selectDomain}
              domainScores={domainScores}
              domainSorted={domainSorted}
            />
          ))
        )}
      </View>

      {/*top (currently moved to bottom tabs) scorecards*/}
      <View style={styles.domainSelection}>
        {domains.map((d, i) => (
          <CircleScoreCard
            key={i}
            selected={selected[d]}
            domain={d}
            score={domainScores[d]}
            onPress={selectDomain}
          />
        ))}
      </View>

      {/*bottom card*/}
      <InfoModal
        description={domainInformation[returnSelectedDomain()].info}
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
      />
      <TouchableHighlight
        onPress={() => setInfoVisible(true)}
        underlayColor="#DDDDDD"
        style={{ height: '8%' }}
      >
        <ThemeContext.Consumer>
          {(theme) => (
            <View
              style={{
                backgroundColor: theme.theme[returnSelectedDomain()],
                padding: 0,
                marginHorizontal: '2%',
                borderRadius: 0,
                height: '100%',
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: screen.height * 0.02,
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Information
              </Text>
            </View>
          )}
        </ThemeContext.Consumer>
      </TouchableHighlight>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          height: '7%',
          justifyContent: 'space-around',
          alignContent: 'space-around',
        }}
      >
        <InfoModal
          description={domainInformation[returnSelectedDomain()].strategy}
          visible={strategyVisible}
          onClose={() => setStrategyVisible(false)}
        />
        <TouchableHighlight
          onPress={() => setStrategyVisible(true)}
          style={{ top: 0, width: '50%' }}
          underlayColor="#DDDDDD"
        >
          <ThemeContext.Consumer>
            {(theme) => (
              <View
                style={{
                  ...styles.bottomButton,
                  backgroundColor: theme.theme[returnSelectedDomain()],
                }}
              >
                <Text style={styles.buttonText}>Strategies</Text>
              </View>
            )}
          </ThemeContext.Consumer>
        </TouchableHighlight>
        <TouchableHighlight
          //modal this, just adding straight to activities to test
          //onPress={() => Actions.push('calendar', { newS: physicalActivities })}
          onPress={() => setDomainVisible(true)}
          style={{ top: 0, width: '50%' }}
          underlayColor="#DDDDDD"
        >
          <ThemeContext.Consumer>
            {(theme) => (
              <View
                style={{
                  ...styles.bottomButton,
                  backgroundColor: theme.theme[returnSelectedDomain()],
                }}
              >
                <Text style={styles.buttonText}> Suggested Activities </Text>
              </View>
            )}
          </ThemeContext.Consumer>
        </TouchableHighlight>
        <Modal
          animationType="fade"
          transparent={true}
          visible={domainVisible}
          onDismiss={() => setDomainVisible(false)}
        >
          <View
            style={{
              display: 'flex',
              marginTop: '55%',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 20,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 22,
                minHeight: 180,
                //alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Text style={{ alignSelf: 'center', fontSize: 20 }}>
                Suggested Activities
              </Text>
              <View>
                <Picker
                  selectedValue={value}
                  onValueChange={(v) => setValue(v.toString())}
                >
                  <Item label="social" value="social" />
                  <Item label="emotional" value="emotional" />
                  <Item label="physical" value="physical" />
                  <Item label="mental" value="mental" />
                  <Item label="spiritual" value="spiritual" />
                </Picker>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                }}
              >
                <Button
                  onPress={() => setDomainVisible(false)}
                  style={{ flexGrow: 1, marginRight: 2 }}
                >
                  <Text>Cancel</Text>
                </Button>
                <Button
                  style={{ flexGrow: 1, marginLeft: 2 }}
                  onPress={() => {
                    setActivityVisible(true);
                    setDomainVisible(false);
                    setActivityValue(pickerItems[value][0].props.label);
                  }}
                >
                  <Text>Next</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={activityVisible}
          onDismiss={() => setActivityVisible(false)}
        >
          <View
            style={{
              display: 'flex',
              marginTop: '55%',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: 20,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 22,
                minHeight: 180,
                //alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Text style={{ alignSelf: 'center', fontSize: 20 }}>
                {value} Activities
              </Text>
              <View>
                <Picker
                  selectedValue={activityValue}
                  onValueChange={(v) => setActivityValue(v.toString())}
                >
                  {pickerItems[value]}
                  {/*               <Item label="yoga" value="yoga" />
                  <Item label="something" value="something" />
                  <Item label="c" value="c" />
                  <Item label="d" value="d" />
                  <Item label="e" value="e" /> */}
                </Picker>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                }}
              >
                <Button
                  onPress={() => setActivityVisible(false)}
                  style={{ flexGrow: 1, marginRight: 2 }}
                >
                  <Text>Cancel</Text>
                </Button>
                <Button
                  style={{ flexGrow: 1, marginLeft: 2 }}
                  onPress={() => {
                    Actions.replace('calendar', {
                      activity: {
                        timestamp: new Date(),
                        date: customLocalDate(new Date()),
                        time: customLocalTime(new Date()),
                        domain: value,
                        description: '',
                        title: activityValue,
                        complete: false,
                      },
                    });
                    setActivityVisible(false);
                  }}
                >
                  <Text>Confirm</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  domainSelection: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    padding: 0,
    height: '6%',
    justifyContent: 'center',
    marginHorizontal: '0%',
  },
  domainCard: {
    backgroundColor: 'white',
    opacity: 0.2,
    justifyContent: 'center',
  },
  domainCardSelected: {
    opacity: 1.0,
    borderColor: 'black',
  },
  bottomButton: {
    backgroundColor: Colors.lightgrey,
    padding: 2,
    margin: 5,
    borderRadius: 16,
    height: '90%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonText: {
    fontSize: screen.height * 0.02,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
