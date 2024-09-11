create database if not exists archery;

use archery;

create table if not exists users (
  id char(36) primary key not null default (UUID()),
  platform varchar(20) not null,
  email varchar(255) not null,
  name varchar(100),
  role int,
  team_id char(36),
  create_time timestamp default current_timestamp
);

create table if not exists sheets (
  id int primary key auto_increment,
  user_id char(36) not null,
  name varchar(30) not null,
  date date not null,
  start_time time default current_time,
  end_time time default current_time,
  place varchar(50),
  create_time timestamp default current_timestamp
);

create table if not exists rounds (
  id int primary key auto_increment,
  user_id char(36) not null,
  sheet_id int not null,
  distance int default 60,
  arrow_count int default 6,
  end_count int default 6,
  place varchar(50),
  create_time timestamp default current_timestamp,
  constraint fk_rounds_sheets foreign key (sheet_id) references sheets(id) on delete cascade
);

create table if not exists ends (
  id int primary key auto_increment,
  user_id char(36) not null,
  round_id int not null,
  scores text,
  constraint fk_ends_rounds foreign key (round_id) references rounds(id) on delete cascade
);

create table if not exists places (
  id int primary key auto_increment,
  user_id char(36) not null,
  name varchar(100) not null,
  create_time timestamp default current_timestamp
);

create table if not exists player_profile (
  user_id char(36) primary key not null,
  image_url varchar(255),
  birth varchar(20),
  gender tinyint(1),
  country varchar(50),
  visible tinyint(1),
  constraint fk_users_player_profile foreign key (user_id) references users(id) on delete cascade
);

create table if not exists teams (
  team_id char(36) default (UUID()),
  owner_id char(36) not null,
  name varchar(50) not null,
  image_url varchar(255),
  description text,
  constraint fk_users_teams foreign key (owner_id) references users(id)
);