import {
  Box,
  DialogTitle,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PieChartIcon from "@mui/icons-material/PieChart";
import CallMadeIcon from "@mui/icons-material/CallMade";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useEffect, useState } from "react";
import SheetCreate from "components/sheet/SheetCreate";
import dayjs from "dayjs";
import TrainCreate from "components/train/TrainCreate";
import TrainView from "./TrainView";
// import { requestFetch, useDataLoader } from "App";
import { useTrains, useSheets } from "utils/context";
import { requestPost } from "utils/fetch";
import { URL } from "constants/url";

const SheetView = ({ sheet, setSheet }) => {
  // const loadData = useDataLoader();
  const [sheets] = useSheets();
  const [trains] = useTrains();
  const [sheetRounds, setSheetRounds] = useState([]);
  const [anchorEl, setAnchorEl] = useState();
  const [editTarget, setEditTarget] = useState();
  const [train, setRound] = useState();
  const [createRound, setCreateRound] = useState(false);

  const editSheet = () => {
    setEditTarget(sheet);
    setAnchorEl(null);
  };
  const deleteSheet = async () => {
    if (!window.confirm("이 시트를 삭제할까요?")) return;
    // requestFetch("delete_sheet", { id: sheet.id });
    const requestOptions = {
      data: { sheet_id: sheet.id },
    };
    const response = await requestPost(URL.DELETE_SHEET, requestOptions);
    if (response.status === 200) {
      setSheet(null);
      // loadData();
    }
  };

  const convertDate = (date) => {
    return date ? dayjs(date).format("YYYY-MM-DD") : null;
  };

  useEffect(() => {
    if (sheet && sheet.trains && train) {
      const exists = sheet.trains.find((r) => r.id === train.id);
      if (exists) setRound(exists);
    }
  }, [sheets]);

  useEffect(() => {
    const sheetRounds = trains.filter((r) => r.sheet_id === sheet.id);
    setSheetRounds(sheetRounds);
  }, [trains]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", p: 1 }}
      >
        <Button
          variant="contained"
          sx={{ p: 1 }}
          onClick={() => setSheet(null)}
        >
          <ArrowBackIcon />
        </Button>
        <ButtonGroup
          sx={{ gap: 1, "& .MuiButton-root": { p: 1, borderRadius: 1 } }}
        >
          <Button variant="contained">
            <PieChartIcon />
          </Button>
          <Button variant="contained" onClick={() => setCreateRound(true)}>
            <AddIcon />
          </Button>
          <Button
            variant="contained"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon />
          </Button>
        </ButtonGroup>
      </DialogTitle>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
          <span>시트이름</span>
          <span>{sheet.name}</span>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
          <span>날짜</span>
          <span>{convertDate(sheet.date)}</span>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
          <span>시간</span>
          <span>
            {dayjs(
              `${dayjs(sheet.date).format("YYYYMMDD")}${sheet.start_time}`
            ).format("a h:mm")}
            &nbsp;-&nbsp;
            {dayjs(
              `${dayjs(sheet.date).format("YYYYMMDD")}${sheet.end_time}`
            ).format("a h:mm")}
          </span>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
          <span>장소</span>
          <span>{sheet.place ? sheet.place : "미지정"}</span>
        </Box>
      </Box>
      <Divider />
      {sheetRounds && sheetRounds.length > 0 ? (
        <Box sx={{ flex: 1 }}>
          {sheetRounds.map((r, index) => (
            <MenuItem
              onClick={() => setRound(r)}
              key={`train_${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#f3f3f3",
              }}
            >
              <span>R{index + 1}</span>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CallMadeIcon />
                  {r.arrow_count}
                </Box>
                <span>X</span>
                <span>{r.end_count}엔드</span>
              </Box>
              <ArrowForwardIosIcon sx={{ width: 20, height: 20 }} />
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
            onClick={() => setCreateRound(true)}
          >
            <AddIcon />
          </Button>
          버튼을 눌러 라운드를 추가해보세요!
        </Box>
      )}

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={editSheet}>시트 수정</MenuItem>
        <MenuItem onClick={deleteSheet}>시트 삭제</MenuItem>
      </Menu>

      {editTarget && (
        <SheetCreate
          close={() => setEditTarget(null)}
          setSheet={setSheet}
          editTarget={editTarget}
        />
      )}
      {createRound && (
        <TrainCreate sheet={sheet} close={() => setCreateRound(false)} />
      )}
      {train && (
        <TrainView
          sheet={sheet}
          train={train}
          setRound={setRound}
          close={() => setRound(null)}
        />
      )}
    </Box>
  );
};

export default SheetView;
