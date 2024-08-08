import { useEffect, useState } from "react";
import {
  Box,
  DialogTitle,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PieChartIcon from "@mui/icons-material/PieChart";

const RoundView = ({ round, close }) => {
  const [anchorEl, setAnchorEl] = useState();

  const getRoundData = () => {
    const savedRoundsData = localStorage.getItem("roundData")
      ? JSON.parse(localStorage.getItem("roundData"))
      : null;
    if (!savedRoundsData) return;
  };

  const editRound = () => {};
  const deleteRound = () => {};

  useEffect(() => {
    getRoundData();
  }, []);
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        bgcolor: "#fff",
        zIndex: 2,
      }}
    >
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", p: 1 }}
      >
        <Button variant="contained" sx={{ p: 1 }} onClick={close}>
          <ArrowBackIcon />
        </Button>
        <ButtonGroup
          sx={{ gap: 1, "& .MuiButton-root": { p: 1, borderRadius: 1 } }}
        >
          <Button variant="contained">
            <PieChartIcon />
          </Button>
          <Button
            variant="contained"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon />
          </Button>
        </ButtonGroup>
      </DialogTitle>
      Round View
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={editRound}>시트 수정</MenuItem>
        <MenuItem onClick={deleteRound}>시트 삭제</MenuItem>
      </Menu>
    </Box>
  );
};

export default RoundView;
