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
	Button,
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

const opacityVal = 0.4;

export function ReportDetails(props: ReportDetailsProps) {
	const [item, setItem] = useState(props.item);
	// array to hold all questions
	const [questions, setQuestions] = useState([]);
	//arrays to hold answers values from each domain
	const [highlighted, setHighlighted] = useState('averages');
	const [timeHighlighted, setTimeHighlighted] = useState('week');
	// const [timeLimit, setTimeLimit] = useState(15);
	const [fetchedQs, setFetchedQs] = useState();
	const [qsAns, setQsAns] = useState([]);
	const [once, setOnce] = useState(1);

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
		let ques = [];
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
						ques.push(element.questions);
					}
				}
			});
			setQuestions(ques);
		}

		//if we have questions ---- this is redundant  if the survey is complete we do have questions in the database
		if (ques.length) {
			ques.forEach((q) => {
				// use Object.values to get the data of question
				let question = Object.values(q);

				// find the domain and add the answer in the relevant array
				question.forEach((que) => {
					switch (que.domain) {
						case 'social': {
							soc.push(que.response);
							break;
						}
						case 'emotional': {
							emo.push(que.response);
							break;
						}
						case 'physical': {
							phy.push(que.response);
							break;
						}
						case 'mental': {
							men.push(que.response);
							break;
						}
						case 'spiritual': {
							spi.push(que.response);
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
		} else if (type == 'social') displaydata(soc);
		else if (type == 'emotional') displaydata(emo);
		else if (type == 'physical') displaydata(phy);
		else if (type == 'mental') displaydata(men);
		else if (type == 'spiritual') displaydata(spi);
	};

	//dataset for barchart to be used after processing chart data from firebase
	const displaydata = (domainarray: any[]) => {
		domainarray = domainarray.splice(0, 10);

		setData({
			labels: domainarray.map((value, index) => {
				return index.toString();
			}),
			datasets: [
				{
					data: domainarray.map((value: number) => {
						return value;
					}),
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

		for (var i in questions[0]) {
			Object.values(fetchedQs).forEach((cat) => {
				if (
					(type == 'all' && cat[i] !== undefined) ||
					(questions[0][i].domain == type && cat[i] !== undefined)
				) {
					temp.push({
						domain: questions[0][i].domain,
						key: i,
						qs: cat[i].description,
						ans: questions[0][i].response,
					});
				}
			});
		}
		setQsAns(temp);
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
													// setTimeLimit(14);
													setTimeHighlighted('week');
													getData(14, 'averages');
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
													// setTimeLimit(14);
													setTimeHighlighted('week');
													getData(14, 'social');
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
													// setTimeLimit(14);
													setTimeHighlighted('week');
													getData(14, 'emotional');
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
													// setTimeLimit(14);
													setTimeHighlighted('week');
													getData(14, 'physical');
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
													// setTimeLimit(14);
													setTimeHighlighted('week');
													getData(14, 'mental');
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
													// setTimeLimit(14);
													setTimeHighlighted('week');
													getData(14, 'spiritual');
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
													// setTimeLimit(1);
													getData(1, highlighted);
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
													// setTimeLimit(15);
													getData(15, highlighted);
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
													// setTimeLimit(32);
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

								<View
									style={{
										...styles.chip,
										borderColor: 'white',
										backgroundColor: 'dodgerblue',
										alignItems: 'center',
										justifyContent: 'center',
										width: 200,
										height: 35,
										alignSelf: 'center',
										marginVertical: 15,
									}}
								>
									<TouchableOpacity onPress={createExcel}>
										<Text style={{ color: 'white', fontWeight: 'bold' }}>
											{'Export Excel'}
										</Text>
									</TouchableOpacity>
								</View>

								<FlatList
									data={qsAns}
									keyExtractor={(item) => item.key}
									// style={{
									//   marginTop: 20,
									// }}
									renderItem={({ item }) => (
										<View
											style={{
												backgroundColor: theme.theme[item.domain],
												paddingHorizontal: 15,
												paddingVertical: 5,
											}}
										>
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
							</>
						)}
					</ThemeContext.Consumer>
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
