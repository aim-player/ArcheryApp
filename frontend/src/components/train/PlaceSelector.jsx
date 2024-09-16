import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { URL } from "constants/url";
import { useEffect, useState } from "react";
import { usePlaces } from "utils/context";
import { requestGet, requestPost } from "utils/fetch";

import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const PlaceSelector = ({ open, onClose, onSelect }) => {
  const [place, setPlace] = useState("");
  const [places, setPlaces] = usePlaces();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const getPlaces = async () => {
    const response = await requestGet(URL.GET_PLACES);
    if (response.status === 200) {
      const { places } = response.data;
      setPlaces(places);
    }
  };
  const addPlace = async () => {
    const exists = places.find((p) => p === place);
    if (exists) return alert("이미 추가된 장소입니다.");
    const requestOptions = {
      data: { name: place },
    };
    const response = await requestPost(URL.ADD_PLACE, requestOptions);
    if (response.status === 200) {
      getPlaces();
      setPlace("");
      setOpenAddDialog(false);
    }
  };
  const deletePlace = async (place) => {
    if (window.confirm("이 장소를 삭제할까요?")) {
      const requestOptions = {
        data: {
          place_id: place.id,
        },
      };
      const response = await requestPost(URL.DELETE_PLACE, requestOptions);
      if (response.status === 200) getPlaces();
    }
  };
  const onChangePlaceName = (e) => {
    if (e.target.value.length > 20)
      return alert("장소이름은 최대 20자까지 입력가능해요.");
    setPlace(e.target.value);
  };
  useEffect(() => {
    getPlaces();
  }, []);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDialog-paper": { width: "100%" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body">장소</Typography>
        <Button variant="contained" sx={{ p: 0.5 }} onClick={onClose}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mb: 2,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {places.length > 0 ? (
            places.map((place, index) => (
              <Box
                key={`place_${index}`}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 0,
                  "& .MuiButton-root": { p: 1, borderRadius: 1 },
                  borderBottom: "1px solid #eee",
                  paddingBottom: 1,
                }}
              >
                <span>{place.name}</span>
                <ButtonGroup
                  sx={{
                    display: "flex",
                    gap: 1,
                    "& .MuiButton-root": { borderRadius: 1 },
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      onSelect(place.name);
                      onClose();
                    }}
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => deletePlace(place)}
                  >
                    <DeleteIcon />
                  </Button>
                </ButtonGroup>
              </Box>
            ))
          ) : (
            <Typography variant="body">
              저장된 장소가 없어요.
              <br />
              새로운 장소를 추가해보세요!
            </Typography>
          )}
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ p: 0.5 }}
          onClick={() => setOpenAddDialog(true)}
        >
          <AddIcon />
          장소 추가하기
        </Button>
      </DialogContent>
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        sx={{ "& .MuiDialog-paper": { width: "100%" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body">장소 추가</Typography>
          <Button
            variant="contained"
            sx={{ p: 0.5 }}
            onClick={() => setOpenAddDialog(false)}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            fullWidth
            sx={{
              display: "block",
              "& .MuiInputBase-root": { p: 1, mb: 1 },
            }}
            placeholder="장소를 입력해주세요(최대 20자)"
            value={place}
            onChange={onChangePlaceName}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={addPlace}
            sx={{ p: 1 }}
          >
            추가
          </Button>
        </DialogContent>
      </Dialog>
      ;
    </Dialog>
  );
};
export default PlaceSelector;
