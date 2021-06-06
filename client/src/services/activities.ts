import firebase from 'firebase';

export type Activity = {
  _id: string;
  date: string;
  time: string;
  timestamp: Date;
  title: string;
  domain: string;
  description: string;
  complete: boolean;
  deleted?: boolean;
};

export type ActivityAgenda = { [date: string]: Activity[] };

/**
 * Update activities for a given date. Note that the update takes in the entire
 * items array for a given date
 * @param date - ISO-8601 date (YYYY-MM-DD)
 * @param activities - all items for this day
 */
export async function updateActivities(
  date: string,
  activities: Activity[],
): Promise<void> {
  // Normalize activity ids
  activities = activities.map((a) => {
    if (!a._id) return { ...a, _id: a.timestamp.getTime().toString() };
    return a;
  });

  const user = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref(`users/${user}/activities/${date}`);
  return ref.update(activities);
}

/**
 * Returns all activities for the logged in user.
 */
export async function getActivities(): Promise<ActivityAgenda> {
  const user = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref(`users/${user}/activities`);

  return await (await ref.get()).val();
}
