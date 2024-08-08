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
import RoundCreate from "components/round/RoundCreate";
import RoundView from "./RoundView";

const SheetView = ({ sheet, setSheet, loadSheets }) => {
  const [anchorEl, setAnchorEl] = useState();
  const [editTarget, setEditTarget] = useState();
  const [rounds, setRounds] = useState([]);
  const [round, setRound] = useState();
  const [createRound, setCreateRound] = useState(false);
  const editSheet = () => {
    setEditTarget(sheet);
    setAnchorEl(null);
  };
  const deleteSheet = () => {
    if (!window.confirm("이 시트를 삭제할까요?")) return;
    const savedSheets = localStorage.getItem("sheets")
      ? JSON.parse(localStorage.getItem("sheets"))
      : [];
    const restSheets = savedSheets.filter(
      (d) => d.created_at !== sheet.created_at
    );
    localStorage.setItem("sheets", restSheets);
    setSheet(null);
    loadSheets();
  };

  const loadRounds = () => {
    const savedRounds = localStorage.getItem("rounds")
      ? JSON.parse(localStorage.getItem("rounds"))
      : null;
    if (!savedRounds) return;

    const sheetRounds = savedRounds[sheet.created_at];
    if (!sheetRounds) return;
    setRounds(sheetRounds);
  };

  useEffect(() => {
    loadRounds();
  }, []);

  useEffect(() => {
    const getRoundsData = () => {
      const roundsData = {};
      const savedRoundsData = localStorage.getItem("roundsData")
        ? JSON.parse(localStorage.getItem("roundsData"))
        : {};
      rounds.forEach((r) => {
        if (savedRoundsData[r.created_at])
          roundsData[r.created_at] = savedRoundsData[r.created_at];
      });
    };
    if (rounds.length > 0) getRoundsData();
  }, [rounds]);

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
          <span>{sheet.date}</span>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
          <span>시간</span>
          <span>
            {dayjs(`${sheet.date}${sheet.startTime}`).format("a h:mm")}
            &nbsp;-&nbsp;
            {dayjs(`${sheet.date}${sheet.endTime}`).format("a h:mm")}
          </span>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
          <span>장소</span>
          <span>{sheet.place}</span>
        </Box>
      </Box>
      <Divider />
      {rounds.length > 0 ? (
        <Box sx={{ flex: 1 }}>
          {rounds.map((r, index) => (
            <MenuItem
              onClick={() => setRound(r)}
              key={`round_${index}`}
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
                  {r.arrowCount}
                </Box>
                <span>X</span>
                <span>{r.endCount}엔드</span>
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
          loadSheets={loadSheets}
        />
      )}
      {createRound && (
        <RoundCreate
          sheet={sheet}
          close={() => setCreateRound(false)}
          loadRounds={loadRounds}
        />
      )}
      {round && <RoundView round={round} close={() => setRound(null)} />}
    </Box>
  );
};

export default SheetView;
