create database if not exists archery;

use archery;

create table if not exists users (
  id char(36) primary key not null,
  platform varchar(20) not null,
  email varchar(255) not null,
  name varchar(100),
  role int,
  team_id char(36),
  image_url varchar(255),
  create_time timestamp default current_timestamp
);

create table if not exists trains (
  id int primary key auto_increment,
  user_id char(36) not null,
  team_id char(36),
  distance int default 60,
  arrow_count int default 6,
  end_count int default 6,
  place varchar(50),
  total_score int default 0,
  total_shot int default 0,
  create_time timestamp default current_timestamp
);

create table if not exists ends (
  id int primary key auto_increment,
  user_id char(36) not null,
  train_id int not null,
  scores text,
  constraint fk_ends_trains foreign key (train_id) references trains(id) on delete cascade
);

create table if not exists places (
  id int primary key auto_increment,
  user_id char(36) not null,
  name varchar(100) not null,
  create_time timestamp default current_timestamp
);

create table if not exists player_profile (
  user_id char(36) primary key not null,
  birth varchar(20),
  gender tinyint(1),
  country varchar(50),
  visible tinyint(1) default 1,
  constraint fk_users_player_profile foreign key (user_id) references users(id) on delete cascade
);

create table if not exists teams (
  team_id char(36) primary key not null,
  owner_id char(36) not null,
  name varchar(50) not null,
  image_url varchar(255),
  description text,
  constraint fk_users_teams foreign key (owner_id) references users(id)
);

create table if not exists team_invitations (
  id int auto_increment primary key,
  team_id char(36) not null,
  player_id char(36) not null,
  content text not null,
  is_read tinyint(1) default 0,
  create_time timestamp default current_timestamp,
  constraint fk_teams_team_invitations foreign key (team_id) references teams(team_id) on delete cascade,
  constraint fk_users_team_invitations foreign key (player_id) references users(id) on delete cascade
);