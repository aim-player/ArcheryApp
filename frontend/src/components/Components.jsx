const { Dialog, Button, Box } = require("@mui/material");
const { useAlert, useConfirm } = require("utils/context");

export const CustomAlert = () => {
  const [alert, setAlert] = useAlert();

  return (
    <Dialog open={alert.active} sx={{ "& .MuiPaper-root": { p: 1 } }}>
      <Box sx={{ p: 1 }}>{alert.message}</Box>
      <Button
        sx={{ py: 0.5 }}
        variant="contained"
        onClick={() => {
          if (alert.callbackFn) alert.callbackFn();
          setAlert((state) => ({ ...state, active: false }));
        }}
      >
        확인
      </Button>
    </Dialog>
  );
};
export const CustomConfirm = () => {
  const [confirm, setConfirm] = useConfirm();

  return (
    <Dialog
      open={confirm.active}
      fullWidth
      sx={{ "& .MuiPaper-root": { p: 1 } }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
        {confirm.message}
      </Box>
      <Box sx={{ display: "flex", gap: 1, p: 1 }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{ p: 0.5 }}
          onClick={() =>
            setConfirm((state) => ({
              ...state,
              active: false,
              callbackFn: null,
            }))
          }
        >
          취소
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ p: 0.5 }}
          onClick={() => {
            if (confirm.callbackFn) confirm.callbackFn();
            setConfirm((state) => ({
              ...state,
              active: false,
              callbackFn: null,
            }));
          }}
        >
          확인
        </Button>
      </Box>
    </Dialog>
  );
};
