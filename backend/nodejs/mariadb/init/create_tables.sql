create database if not exists archery;

use archery;

create table if not exists users (
  id char(36) primary key not null default (UUID()),
  role int,
  platform varchar(20) not null,
  email varchar(255) not null,
  name varchar(100),
  team_name varchar(100),
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