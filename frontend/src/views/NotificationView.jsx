import { Box, Button, Divider, Paper } from "@mui/material";
import { URL } from "constants/url";
import { useEffect, useState } from "react";
import { useAlert, useConfirm } from "utils/context";
import { requestGet, requestPost } from "utils/fetch";

const NotificationView = ({ close }) => {
  const [, setAlert] = useAlert();
  const [, setConfirm] = useConfirm();
  const [notifications, setNotifications] = useState({});
  const getNotifications = async () => {
    const response = await requestGet(URL.GET_NOTIFICATIONS);
    if (response.status === 200) {
      setNotifications(response.data);
    }
  };
  const acceptInvitation = async (team_id) => {
    const requestOptions = { data: { team_id } };
    const response = await requestPost(URL.ACCEPT_INVITE, requestOptions);
    if (response.status === 200) {
      getNotifications();
      setAlert({ active: true, message: "팀에 가입되었어요." });
    }
  };
  const rejectInvitation = async (team_id) => {
    const requestOptions = { data: { team_id } };
    const response = await requestPost(URL.REJECT_INVITE, requestOptions);
    if (response.status === 200) {
      getNotifications();
      setAlert({ active: true, message: "초대를 거절했어요." });
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <Paper
      elevation={6}
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        left: 16,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        height: "50%",
        borderRadius: 1,
        bgcolor: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          borderBottom: "1px solid #000",
        }}
      >
        <Box>알림</Box>
        <Button onClick={close}>닫기</Button>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowY: "auto",
        }}
      >
        {notifications.invitations && (
          <Box sx={{ p: 1 }}>
            <Box sx={{ mb: 1 }}>팀 초대</Box>
            <Divider />
            <Box>
              {notifications.invitations.map((invitation, index) => {
                const content = JSON.parse(invitation.content);
                return (
                  <Box
                    key={`invitation_${index}`}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      fontSize: 14,
                      bgcolor: "#efefef",
                    }}
                  >
                    <Box>[{content.team_name}] 팀이 초대를 보냈습니다.</Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        sx={{ px: 1, py: 0.5 }}
                        onClick={() =>
                          setConfirm({
                            active: true,
                            message: "초대를 수락할까요?",
                            callbackFn: () =>
                              acceptInvitation(invitation.team_id),
                          })
                        }
                      >
                        가입
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ px: 1, py: 0.5 }}
                        color="error"
                        onClick={() =>
                          setConfirm({
                            active: true,
                            message: "초대를 거절할까요?",
                            callbackFn: () =>
                              rejectInvitation(invitation.team_id),
                          })
                        }
                      >
                        거절
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
export default NotificationView;
