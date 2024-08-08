import { useEffect, useState } from "react";
import { Box, Button, Dialog, MenuItem, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import SheetCreate from "components/sheet/SheetCreate";
import SheetView from "./SheetView";

const SheetsView = () => {
  const [open, setOpen] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [sheet, setSheet] = useState();

  const loadSheets = () => {
    const savedSheets = localStorage.getItem("sheets");
    if (savedSheets) setSheets(JSON.parse(savedSheets));
    else setSheets([]);
  };
  
  useEffect(() => {
    loadSheets();
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
        <Typography variant="h5">기록시트</Typography>
        <Button
          variant="contained"
          sx={{ width: 40, height: 40 }}
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Button>
      </Box>
      {sheets.length > 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            overflowY: "auto",
          }}
        >
          {sheets.map((sheet, index) => (
            <MenuItem
              key={`sheet_${index}`}
              onClick={() => setSheet(sheet)}
              sx={{ bgcolor: "#f3f3f3" }}
            >
              {sheet.name}
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
          <Button variant="contained" sx={{ mr: 0.5 }}>
            <AddIcon />
          </Button>
          버튼을 눌러 시트를 추가해보세요!
        </Box>
      )}
      {open && (
        <SheetCreate
          close={() => setOpen(false)}
          loadSheets={loadSheets}
          setSheet={setSheet}
        />
      )}
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
        {sheet && (
          <SheetView
            sheet={sheet}
            setSheet={setSheet}
            loadSheets={loadSheets}
          />
        )}
      </Dialog>
    </Box>
  );
};
export default SheetsView;
