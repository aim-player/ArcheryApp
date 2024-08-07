import {
  Box,
  Button,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SheetCreate = ({ close }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bgcolor: "#fff",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 1,
          gap: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Button variant="contained" sx={{ padding: 1 }} onClick={close}>
          <ArrowBackIcon />
        </Button>
        <Typography variant="h5">시트 만들기</Typography>
      </Box>
      <Box sx={{ padding: 1 }}>
        <Typography variant="body">시트정보</Typography>
        {/* <FormControlLabel /> */}
        <Typography variant="body">시트이름</Typography>
        <TextField
          autoComplete="off"
          placeholder="시트이름"
          sx={{
            display: "block",
            "& .MuiInputBase-root": { width: "100%", padding: 1 },
          }}
        />
      </Box>
    </Box>
  );
};

export default SheetCreate;
