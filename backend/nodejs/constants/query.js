const QUERY = {
  GET_USER: "select * from users where platform=? and email=?",
  CREATE_USER:
    "insert into users (id, platform, email) values (?, ?, ?) returning *",
  UPDATE_USER_NAME: "update users set name=? where id=?",

  ADD_PLAYER_PROFILE: "insert into player_profile (user_id) values (?)",
  GET_PLAYER_PROFILE: "select * from player_profile where user_id=?",
  ADD_PROFILE: "update users set role=?, name=? where email=?",
  ADD_SHEET:
    "insert into sheets (user_id, name, date, start_time, end_time, place) values (?, ?, ?, ?, ?, ?) returning *",
  ADD_TRAIN:
    "insert into trains (user_id, distance, arrow_count, end_count, place) values(?, ?, ?, ?, ?) returning *",
  ADD_END:
    "insert into ends (user_id, train_id, scores) values (?, ?, ?) returning *",
  ADD_PLACE: "insert into places (user_id, name) values (?, ?) returning *",
  GET_SHEETS: "select * from sheets where user_id=?",
  GET_TRAINS: "select * from trains where user_id=?",
  GET_TRAIN: "select * from trains where user_id=? and id=?",
  GET_ENDS: "select * from ends where user_id=? and train_id=?",
  GET_PLACES: "select  * from places where user_id=?",
  DELETE_SHEET: "delete from sheets where id=? and user_id=?",
  DELETE_TRAIN: "delete from trains where id=? and user_id=?",
  DELETE_END: "delete from ends where id=? and user_id=?",
  DELETE_PLACE: "delete from places where user_id=? and id=?",
  UPDATE_SHEET:
    "update sheets set name=?, date=?, start_time=?, end_time=?, place=? where id=? and user_id=?",
  UPDATE_TRAIN:
    "update trains set distance=?, arrow_count=?, end_count=? where id=? and user_id=?",
  UPDATE_END: "update ends set scores=? where id=? and user_id=?",
  UPDATE_TRAIN_STATS:
    "update trains set total_score=?, total_shot=? where id=? and user_id=?",
  GET_TEAM: "select * from teams where team_id=?",
  GET_TEAM_PLAYERS: "select * from users where team_id=?",
  CREATE_TEAM:
    "insert into teams (team_id, owner_id, name, description) values (?, ?, ?, ?)",
  INVITE_TEAM:
    "insert into team_invitations (team_id, player_id, content) values (?,?,?)",
  GET_TEAM_INVITATIONS:
    "select * from team_invitations where team_id=? or player_id=?",
  ACCEPT_TEAM_INVITATION: "update users set team_id=? where id=?",
  DELETE_TEAM_INVITATION:
    "delete from team_invitations where player_id=? and team_id=?",
  REGISTER_PLAYER: "update users set team_id=? where id=?",
  FIND_PLAYER: `select u.id, u.name, u.image_url, t.name as team_name 
  from users u 
  join player_profile p on u.id = p.user_id 
  left join teams t on u.team_id = t.team_id 
  where u.role=1 and p.visible=1 and u.name=?`,

  GET_PLAYER_INVITATIONS: "select * from team_invitations where player_id=?",
};

module.exports = {
  QUERY,
};
