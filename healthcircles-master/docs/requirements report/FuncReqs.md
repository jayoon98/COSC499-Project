# functional requirements

1. Users are prompted to do a tutorial when they first open the app
    1. Users are able to skip tutorial, but will be warned of missed benefit (potentially they are just redownloading the app, or installing it on a new device)
    2. Users are pointed to the menu, navigation, registration areas, and then are lead to doing the initial questionnaire
    3. Initial questionnaire starts with a terms of service acceptance page
    4. Followed by an information page about what the goals of the app are for the user
    5. Next is a colour scheme selection option, where users can choose from a list of predefined colour schemes, or create their own
    6. Then the user is asked to set a time for daily notifications for a reminder to open the app and check in. This prompts the mobile device to allow push notifications

2. Users do initial health questionnaire, preferably doing all 4 or 5 domains
    1. Users have the option to choose which domains to do the questionnaire for, and then can prioritize domains in order of importance
    2. The questionnaire has general questions to start, followed by each specific domain questions, areas of each domain are self ranked 1-7 (such as sleep rating in the physical domain)
    3. The system will score each domain individually, time-stamp the questionnaire, and then create/adjust graphic plot/circle
    4. The results are visualized for the user to see
        1. Visualization screen shows each colour coded domain as a circle with a common centre point. The radius of the circle is relative to the score achieved in that domain questionnaire. 
        2. Users can press the circles to change priority domains
        3. Users can press a button to be linked to an online store to purchase prints of their visualization/avatar
    5. Users are given option to see recommended activities/readings/add to calendar
    6. Users have the ability to redo the initial health questionnaire at a later date

3. Users can register for an account with email and password
    1. The system will send email to confirm email address and registration
    2. Once email confirmed, a user will setup initial profile with name, and whether they are a patient of Dr. Dawson
    3. If user selects patient option, they will be asked to agree to another information sharing agreement specific to patients
    4. Users have the option to select/upload profile pic or select an avatar

4. Users can access a calendar within the app. The default calendar is a full screen month with numbers, and a colour coded circle around the number where an acion item is setup. The colour matches the domain of the action item.
    1. The calendar has preloaded action items (An activity, recommended, preloaded or user defined that is designed to improve a specific health domain). Preloaded items are pulled from a preset list based on the prioritized domain.
    2. Users have the ability to move, add, change or delete actions items
    3. users can set notifications, reminders for certain action items
    4. Users can change mode within the calendar to a list of action items sorted by date
    5. Users can then change the list to filter by domain instead of date

5. The first time a user opens the app each day, users are greeted with uplifting message/quote or small action item (ex. "Have you smiled today?" or "Strike a power pose!")
    1. Users are then prompted to pick domains to update (0 to all), while being shown how long it has been since last update for each
    2. Once selected domains are updated, users are brought to current day on calendar with action items

6. Users have access to a bottom navigation menu
    1. Buttons to jump directly to calendar, domain questionnaires, stats/visualization, account
    2. Standard back to previous screen button

7. Users are given the option to change settings, change data sharing and notification preferences
    1. option to erase all personal data from server/device
    2. The settings option is a menu item with a list of each changeable item

8. Users have an option for account recovery if they have forgot their password
    1. The user types in their email
    2. If an account exists with the email, an email is sent with a temporary password 

9. Users have an option to share to social media function on domain visualization screen
    1. Users are also able to share their daily uplifting quote/message
    2. Users can also share their success when they input they have completed an activity

10. Dr. Dawson is provided unique access to users shared information through a web app
    1. UI for visualization of group data
    2. Provides list of users who aren't updating their domains
    3. Provides users who show (significantly) declining health domains, or in worrisome range
    4. Dr. Dawson has the option to add/update surveys/questionnaires/quotes/messages
        1. Core domain survey updates are restricted to changing wording of domain/area of domain wording without affecting cumalitive data and scoring. If number of areas in a domain is adjusted, then cumalitive scoring for that data will be reset for all users.
        2. Domains can be added/removed without affecting other domain data
        3. Added surveys will be set to record data but will provide Dr. Dawson with limited visualitions in his UI
