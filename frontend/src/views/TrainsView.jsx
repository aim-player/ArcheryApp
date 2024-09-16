import { useEffect, useState } from "react";
import { Box, Button, Dialog, MenuItem, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import SheetCreate from "components/sheet/SheetCreate";
import SheetView from "./SheetView";
import { requestGet } from "utils/fetch";
import { URL } from "constants/url";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const TrainsView = () => {
  const navigate = useNavigate();
  const [trains, setTrains] = useState([]);
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState();
  
  const getTrains = async () => {
    const response = await requestGet(URL.GET_TRAINS);
    console.log("response: ", response);
    if (response.status === 200) {
      const { trains } = response.data;
      setTrains(trains);
    }
  };
  useEffect(() => {
    getTrains();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Typography variant="h5">훈련기록</Typography>
        <Button
          variant="contained"
          sx={{ width: 40, height: 40 }}
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Button>
      </Box>
      {trains.length > 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            overflowY: "auto",
          }}
        >
          {trains.map((train, index) => (
            <MenuItem
              key={`train_${index}`}
              onClick={() => navigate(URL.TRAIN, { state: { id: train.id } })}
              sx={{ bgcolor: "#f3f3f3" }}
            >
              {dayjs(train.create_time).format("YYYY-MM-DD HH:mm")}
            </MenuItem>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{ mr: 0.5 }}
            onClick={() => setOpen(true)}
          >
            <AddIcon />
          </Button>
          버튼을 눌러 시트를 추가해보세요!
        </Box>
      )}
      {open && <SheetCreate close={() => setOpen(false)} setSheet={setSheet} />}
      <Dialog
        open={!!sheet}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            height: "100%",
            margin: 0,
            maxHeight: "100%",
          },
        }}
        onClose={() => setSheet(null)}
      >
        {sheet && <SheetView sheet={sheet} setSheet={setSheet} />}
      </Dialog>
    </Box>
  );
};
export default TrainsView;
