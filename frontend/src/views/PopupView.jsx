import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import GoogleLogin from "components/login/GoogleLogin";
import { usePopup } from "utils/context";

const PopupView = () => {
  const [popup] = usePopup();
  return (
    <>
      <Dialog open={popup.login}>
        <DialogTitle align="center">로그인</DialogTitle>
        <DialogContent>
          <GoogleLogin />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PopupView;
