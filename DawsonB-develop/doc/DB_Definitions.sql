create table `users` (
  `uid` int auto_increment,
  `email` varchar(255) not null, 
  `pass_hash` varchar(255) not null, -- hashed password
  `first_name` varchar(255) not null,
  `last_name` varchar(255) not null,
  `image_path` varchar(255) null, -- profile image URL
  `date_created` timestamp default current_timestamp,
  `last_login` timestamp default current_timestamp,
  `client` boolean not null, -- is user the doctor's client?
  `admin` boolean not null default 0, -- does user have admin privileges?
  primary key (`uid`)
);

-- questions to ask users
create table `questions` (
  `qid` int auto_increment,
  `title` varchar(10000) not null, -- question's title
  `type` int not null, -- 0 = short answer
                 -- 1 = multiple choice (radio)
                 -- 2 = multiple choice (checkbox)
                 -- 3 = scale
                 -- 4 = ranking
  `date_created` timestamp default current_timestamp,
  `extra_sa` boolean default false, -- extra short answer included? if so, will be the linked 'sa_questions' with highest subid
  `domain` int not null, -- domain linked to this question. 1 = Physical, etc. see /frontend/constants/index.js
  `deleted` boolean default false, -- never hard-delete questions, just mark as deleted. prevents from showing even in admin panel
  `disabled` boolean default false, -- same idea as `deleted`, but allows questions to still show in admin panel
  primary key (`qid`)
);

-- users' individual answers to questions
create table `answers` (
  `sid` int not null, -- allows multiple answers to one question per user
  `qid` int not null,
  `answer` varchar(10000) null, -- interpreted based on linked 'questions.type', stored as JSON
  primary key (
    `sid`,
    `qid`
  ),
  foreign key (`sid`)
    references `surveys` (`sid`),
  foreign key (`qid`)
    references `questions` (`qid`)
);

-- sets of user answers
create table `surveys` (
  `sid` int auto_increment,
  `uid` int not null,
  `date_answered` timestamp default current_timestamp,
  primary key (`sid`),
  foreign key (`uid`)
    references `users` (`uid`)
);

-- user preferences
create table `preferences` (
  `uid` int not null,
  `circle_colors` varchar(255) null, -- eg, "FF0000,00FF00,00FFFF,FFFF00,000000"
  `circle_rank` varchar(5) null, -- eg, "45231", ranking left-to-right (eg, circle --4 is 1st)
  `notify_time` int null, -- min. time between notifications, in days
  `avatar` varchar(50) not null default "0,0,0,0,0", -- avatar customization string (bg, torso, skin, mood, hair)
  `max_score` int default 0, -- maximum score possible (used for MCC, MCR, ranking)
  `min_score` int default 0, -- minimum score possible (used for MCC, MCR, ranking)
  primary key (`uid`),
  foreign key (`uid`)
    references `users` (`uid`)
);

-- short answer (used for many question types)
create table `sa_questions` (
  `qid` int not null,
  `subid` int not null, -- for each qid: 0, 1, ..., n
  `text` varchar(255) null,
  -- no weighting possible, so implied weight of 0
  primary key (
    `qid`,
    `subid`
  ),
  foreign key (`qid`)
    references `questions` (`qid`)
);

-- multiple choice
create table `mc_questions` (
  `qid` int not null,
  `subid` int not null, -- for each qid: 0, 1, ..., n
  `text` varchar(255) not null,
  `weight` int default 0, -- -1 to 1 for checkbox, no limit for radio
  primary key (
    `qid`,
    `subid`
  ),
  foreign key (`qid`)
    references `questions` (`qid`)
);

create table `ranking_questions` (
  `qid` int not null,
  `subid` int not null, -- for each qid: 0, 1, ..., n
  `text` varchar(255) not null,
  `weight` int default 0, -- -1 to 1
  primary key (
    `qid`,
    `subid`
  ),
  foreign key (`qid`)
    references `questions` (`qid`)
);

create table `scale_questions` (
  `qid` int not null,
  `scale` int default 10,
  `note` varchar(255) null, -- note to place above slider. eg, "10 is very happy, 0 is very unhappy"
  `weight` int default 0, -- -1 to 1. 1 means high values increase score, -1 means they reduce score
  primary key (`qid`),
  foreign key (`qid`)
    references `questions` (`qid`)
);

create table `auth` (
  `authkey` varchar(16) not null,
  `uid` int not null,
  `date_created` timestamp default current_timestamp,
  primary key (`authkey`),
  foreign key (`uid`)
    references `users` (`uid`)
);