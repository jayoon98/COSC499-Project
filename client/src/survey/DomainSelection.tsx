import React, { useState } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createSurvey, getSurveyQuestions } from '../services/survey';
import { Colors } from '../colors';
import { ThemeContext } from '../common/ThemeContext';
// TODO @Temporary
const domains = ['social', 'emotional', 'physical', 'mental', 'spiritual'];

type DomainCardProps = {
  domain: string;
  onPress: (domain: string) => void;
  selected?: boolean;
};

function DomainCard({ domain, onPress, selected }: DomainCardProps) {
  // Selected cards have extra styling applied
  const style = selected
    ? { ...styles.domainCard, ...styles.domainCardSelected }
    : styles.domainCard;

  return (
    <TouchableOpacity onPress={() => onPress(domain)} style={{ width: '50%' }}>
      <ThemeContext.Consumer>
        {(theme) => (
          <View
            style={{
              ...style,
              backgroundColor: theme.theme[domain],
            }}
          >
            <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>
              {domain}
            </Text>
          </View>
        )}
      </ThemeContext.Consumer>
    </TouchableOpacity>
  );
}

/**
 * A grid of domain buttons that can be selected before beginning a new survey.
 */
export function DomainSelection() {
  // Default domains selected
  // TODO: These should be stored in local storage at some point
  // (for now no domains are selected)
  const [selected, setSelected] = useState(
    Object.fromEntries(domains.map((d) => [d, false])),
  );

  const selectDomain = (domain: string) => {
    // Copy to be safe (we don't want to be modifying the state directly)
    const selectedCopy = { ...selected };
    selectedCopy[domain] = !selected[domain];
    setSelected(selectedCopy);
  };

  const beginSurvey = async () => {
    const selectedDomains = domains.filter((d) => selected[d]);
    if (selectedDomains.length == 0) {
      return;
    }
    const questions = await getSurveyQuestions(selectedDomains);
    const survey = await createSurvey(selectedDomains);
    Actions.push('survey', { questions, survey });
  };

  // If no domains are selected then the 'begin' questionnaire button is
  // disabled.
  const beginStyle = Object.values(selected).every((v) => !v)
    ? styles.beginCard
    : { ...styles.beginCard, ...styles.domainCardSelected };

  return (
    <View style={styles.domainSelection}>
      {domains.map((d, i) => (
        <DomainCard
          key={i}
          selected={selected[d]}
          domain={d}
          onPress={selectDomain}
        />
      ))}
      <TouchableOpacity
        style={{ width: '50%', display: 'flex', alignItems: 'center' }}
        onPress={beginSurvey}
      >
        <View style={beginStyle}>
          <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>
            Begin
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  domainSelection: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    padding: 6,
  },
  domainCard: {
    backgroundColor: Colors.lightgrey,
    padding: 24,
    margin: 6,
    borderRadius: 400,
    opacity: 0.6,
    minHeight: 160,
    width: 160,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  beginCard: {
    backgroundColor: Colors.lightgrey,
    padding: 24,
    margin: 6,
    borderRadius: 400,
    opacity: 0.5,
    minHeight: 150,
    width: 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainCardSelected: {
    opacity: 1.0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7.6,
    elevation: 5,
  },
});
