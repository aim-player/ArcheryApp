const QUERY = {
  GET_USER: "select * from users where platform=? and email=?",
  CREATE_USER:
    "insert into users (id, platform, email) values (?, ?,?) returning *",

  ADD_PROFILE: "update users set role=?, name=?, team_name=? where email=?",
  ADD_SHEET:
    "insert into sheets (user_id, name, date, start_time, end_time, place) values (?, ?, ?, ?, ?, ?) returning *",
  ADD_ROUND:
    "insert into rounds (user_id, sheet_id, distance, arrow_count, end_count) values(?, ?, ?, ?, ?) returning *",
  ADD_END:
    "insert into ends (user_id, round_id, scores) values (?, ?, ?) returning *",
  GET_SHEETS: "select * from sheets where user_id=?",
  GET_ROUNDS: "select * from rounds where user_id=?",
  GET_ENDS: "select * from ends where user_id=?",
  DELETE_SHEET: "delete from sheets where id=? and user_id=?",
  DELETE_ROUND: "delete from rounds where id=? and user_id=?",
  DELETE_END: "delete from ends where id=? and user_id=?",
  UPDATE_SHEET:
    "update sheets set name=?, date=?, start_time=?, end_time=?, place=? where id=? and user_id=?",
  UPDATE_ROUND:
    "update rounds set distance=?, arrow_count=?, end_count=? where id=? and user_id=?",
  UPDATE_END: "update ends set scores=? where id=? and user_id=?",
};

module.exports = {
  QUERY,
};
