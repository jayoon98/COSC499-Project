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
} from 'react-native';
//chart view
import { BarChart } from 'react-native-chart-kit';
// theme to set domain colors
import { ThemeContext } from '../common/ThemeContext';
import firebase from 'firebase';

// function to get date from string and check if it is within the last 15 days
import { customStringToDate } from '../services/customLocalDate';

//props -- getting the data passed from Report
export type ReportDetailsProps = {
	item: any;
};

const opacityVal = 0.4;

export function ReportDetails(props: ReportDetailsProps) {
	const [item, setItem] = useState(props.item);
	// array to hold all questions
	const [questions, setQuestions] = useState([]);
	//arrays to hold answers values from each domain
	const [social, setSocial] = useState([]);
	const [emotional, setEmotinal] = useState([]);
	const [physical, setPhysical] = useState([]);
	const [mental, setMental] = useState([]);
	const [spiritual, setSpiritual] = useState([]);
	const [highlighted, setHighlighted] = useState('averages');
	const [timeHighlighted, setTimeHighlighted] = useState('week');
	const [timeLimit, setTimeLimit] = useState(15);
	const [fetchedQs, setFetchedQs] = useState();
	const [qsAns, setQsAns] = useState([]);

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
		getData(timeLimit, 'averages');
		fetchQuestions();
		getQsAns();
	}, [fetchedQs]);

	// function to calculate verage value of each domain's answers
	const average = (array: Array<number>) => {
		if (array.length > 0) {
			let sum: number = array.reduce(
				(previous, current) => (current += previous),
			);
			let avg = sum / array.length;
			return avg;
		} else {
			return 0;
		}
	};

	const getData = (timeLimit, type) => {
		const surveys: Object = item.surveys;

		setQuestions([]);
		setData({
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

		// need to iterate through surveys and get the ones that are complete ..
		if (surveys != null) {
			Object.values(surveys).forEach((element) => {
				// if the survey is finished
				if (element.completed) {
					// only if the survey is within the last two weeks :
					if (customStringToDate(element.date, timeLimit)) {
						setQuestions([...questions, element.questions]);

						Object.values(element.questions).forEach((que) => {
							switch (que.domain) {
								case 'social': {
									social.push(que.response);
									setSocial(social);
									break;
								}
								case 'emotional': {
									emotional.push(que.response);
									setEmotinal(emotional);
									break;
								}
								case 'physical': {
									physical.push(que.response);
									setPhysical(physical);
									break;
								}
								case 'mental': {
									mental.push(que.response);
									setMental(mental);
									break;
								}
								case 'spiritual': {
									spiritual.push(que.response);
									setSpiritual(spiritual);
									break;
								}
							}
						});
					}
				}
			});
		}

		if (type == 'averages') {
			//dataset for barchart to be used after processing chart data from firebase
			setData({
				labels: ['Social', 'Emotional', 'Physical', 'Mental', 'Spiritual'],
				datasets: [
					{
						data: [
							average(social),
							average(emotional),
							average(physical),
							average(mental),
							average(spiritual),
						],
					},
				],
			});
		} else {
			let domainarray = [];
			switch (type) {
				case 'social': {
					domainarray = social;
					break;
				}
				case 'emotional': {
					domainarray = emotional;
					break;
				}
				case 'physical': {
					domainarray = physical;
					break;
				}
				case 'mental': {
					domainarray = mental;
					break;
				}
				case 'spiritual': {
					domainarray = spiritual;
					break;
				}
			}

			setData({
				labels: Object.values(domainarray).map((value, index) =>
					index.toString(),
				),
				datasets: [
					{
						data: domainarray.map((value: number) => {
							return value;
						}),
					},
				],
			});
			domainarray = null;
		}
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

	const getQsAns = () => {
		let temp = [];

		for (var i in questions[0]) {
			Object.values(fetchedQs).forEach((cat) => {
				if (cat[i] !== undefined) {
					temp.push({
						key: i,
						qs: cat[i].description,
						ans: questions[0][i].response,
					});
				}
			});
		}

		setQsAns(temp);
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
												getData(timeLimit, 'averages');
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
												getData(timeLimit, 'social');
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
											borderColor: highlighted == 'emotional' ? 'white' : null,
											opacity: highlighted == 'emotional' ? 1 : opacityVal,
											backgroundColor: theme.theme['emotional'],
										}}
									>
										<TouchableOpacity
											onPress={() => {
												setHighlighted('emotional');
												getData(timeLimit, 'emotional');
											}}
										>
											<Text
												style={{
													color: highlighted == 'emotional' ? 'white' : 'black',
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
												getData(timeLimit, 'physical');
											}}
										>
											<Text
												style={{
													color: highlighted == 'physical' ? 'white' : 'black',
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
												getData(timeLimit, 'mental');
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
											borderColor: highlighted == 'spiritual' ? 'white' : null,
											opacity: highlighted == 'spiritual' ? 1 : opacityVal,
											backgroundColor: theme.theme['spiritual'],
										}}
									>
										<TouchableOpacity
											onPress={() => {
												setHighlighted('spiritual');
												getData(timeLimit, 'spiritual');
											}}
										>
											<Text
												style={{
													color: highlighted == 'spiritual' ? 'white' : 'black',
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
											borderColor: timeHighlighted == 'day' ? 'white' : null,
											opacity: timeHighlighted == 'day' ? 1 : opacityVal,
											backgroundColor:
												highlighted === 'averages'
													? '#918C8C'
													: theme.theme[highlighted],
										}}
									>
										<TouchableOpacity
											onPress={() => {
												setTimeHighlighted('day');
												setTimeLimit(2);
												getData(2, highlighted);
											}}
										>
											<Text
												style={{
													color: timeHighlighted == 'day' ? 'white' : 'black',
												}}
											>
												{'Daily'}
											</Text>
										</TouchableOpacity>
									</View>

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
												setTimeLimit(15);
												getData(15, highlighted);
											}}
										>
											<Text
												style={{
													color: timeHighlighted == 'week' ? 'white' : 'black',
												}}
											>
												{'Weekly'}
											</Text>
										</TouchableOpacity>
									</View>

									<View
										style={{
											...styles.chip,
											borderColor: timeHighlighted == '' ? 'white' : null,
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
												setTimeLimit(32);
												getData(32, highlighted);
											}}
										>
											<Text
												style={{
													color: timeHighlighted == 'month' ? 'white' : 'black',
												}}
											>
												{'Monthly'}
											</Text>
										</TouchableOpacity>
									</View>
								</View>

								<BarChart
									style={{
										marginTop: 0,
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

										color: (opacity = 1) => `#000`,
										style: {
											// borderRadius: 16,
										},
									}}
								/>
							</View>
						)}
					</ThemeContext.Consumer>

					<FlatList
						data={qsAns}
						keyExtractor={(item) => item.key}
						style={{ marginTop: 20 }}
						renderItem={({ item }) => (
							<View style={{ paddingHorizontal: 15, paddingVertical: 5 }}>
								{item.ans !== undefined && (
									<>
										<Text
											style={{
												fontSize: 16,
												fontWeight: 'bold',
												textAlign: 'justify',
											}}
										>{`Qs: ${item.qs}`}</Text>
										<Text
											style={{
												fontSize: 16,
												textAlign: 'justify',
											}}
										>{`Response: : ${item.ans}`}</Text>
									</>
								)}
							</View>
						)}
					/>
				</View>
			</ScrollView>
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
