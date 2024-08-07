import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import SheetCreate from "components/sheet/SheetCreate";

const RecordView = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Typography variant="h5">기록</Typography>
        <Button
          variant="contained"
          sx={{ width: 40, height: 40 }}
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </Button>
      </Box>
      {open && <SheetCreate close={() => setOpen(false)} />}
    </Box>
  );
};
export default RecordView;
