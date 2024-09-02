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
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDataLoader } from "App";
import { usePlaces, useSheets } from "utils/context";
import { requestGet, requestPost } from "utils/fetch";
import { URL } from "constants/url";

const SheetCreate = ({ close, editTarget }) => {
  const loadData = useDataLoader();
  const [sheets] = useSheets();
  const [places, setPlaces] = usePlaces();
  const [popup, setPopup] = useState({ places: false, addPlace: false });
  const [place, setPlace] = useState("");
  const [inputs, setInputs] = useState({
    name: "",
    place: "",
    date: dayjs(),
    startTime: dayjs(),
    endTime: dayjs(),
  });
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
      setPopup((state) => ({ ...state, places: true, addPlace: false }));
    }
    // requestFetch("update_places", [...places, place]);
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
      // const restPlaces = places.filter((p) => p !== place);
      // requestFetch("update_places", restPlaces);
    }
  };

  const onChangeSheetName = (e) => {
    if (e.target.value.length > 20)
      return alert("장소이름은 최대 20자까지 입력가능해요.");
    setInputs((state) => ({ ...state, name: e.target.value }));
  };

  const onChangePlaceName = (e) => {
    if (e.target.value.length > 20)
      return alert("장소이름은 최대 20자까지 입력가능해요.");
    setPlace(e.target.value);
  };

  const generateSheetId = () => {
    let id = 1;
    sheets.forEach((sheet) => {
      if (sheet.id >= id) id = sheet.id + 1;
    });
    return id;
  };
  const add = async () => {
    // const id = generateSheetId();

    const newSheet = {
      ...inputs,
      startTime: inputs.startTime.format("HH:mm:ss"),
      endTime: inputs.endTime.format("HH:mm:ss"),
      date: inputs.date.format("YYYY-MM-DD"),
      // created_at: dayjs().format("YYYYMMDDHHmmss"),
    };
    const requestOptions = {
      data: newSheet,
    };
    const response = await requestPost(URL.ADD_SHEET, requestOptions);
    if (response.status === 200) {
      loadData();
      close();
    }
    // setSheet(newSheet);
    // requestFetch("add_sheet", newSheet);
    // close();
  };
  const update = async () => {
    const updatedSheet = {
      sheet_id: editTarget.id,
      ...inputs,
      startTime: inputs.startTime.format("HH:mm"),
      endTime: inputs.endTime.format("HH:mm"),
      date: inputs.date.format("YYYY/MM/DD"),
    };
    // setSheet(updatedSheet);
    const requestOptions = {
      data: updatedSheet,
    };
    const response = await requestPost(URL.UPDATE_SHEET, requestOptions);
    if (response.status === 200) {
      loadData();
      close();
    }
    // requestFetch("update_sheet", updatedSheet);
  };

  const applyEditTarget = () => {
    const { name, place, date, start_time, end_time } = editTarget;
    setInputs((state) => ({
      ...state,
      name,
      place,
      date: dayjs(date),
      startTime: dayjs(`${dayjs(date).format("YYYYMMDD")}${start_time}`),
      endTime: dayjs(`${dayjs(date).format("YYYYMMDD")}${end_time}`),
    }));
  };

  useEffect(() => {
    getPlaces();
    if (editTarget) applyEditTarget();
  }, []);

  useEffect(() => {
    if (popup.addPlace) getPlaces();
  }, [popup.addPlace]);

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
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          gap: 1,
          borderBottom: "2px solid #000",
        }}
      >
        <Button variant="contained" sx={{ p: 1 }} onClick={close}>
          <ArrowBackIcon />
        </Button>
        <Typography variant="h5">
          시트 {editTarget ? "수정" : "추가"}
        </Typography>
      </Box>
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, p: 1 }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 1,
          }}
        >
          <TextField
            value={inputs.name}
            onChange={onChangeSheetName}
            autoComplete="off"
            placeholder="시트이름"
            sx={{
              display: "block",
              "& .MuiInputBase-root": { width: "100%", p: 1 },
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              label="날짜"
              value={inputs.date}
              onChange={(e) => setInputs((state) => ({ ...state, date: e }))}
              format="YYYY/MM/DD"
              sx={{ width: "100%", "& .MuiInputBase-root": { p: 1 } }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TimePicker
                label="시작시간"
                format="a HH:mm"
                value={inputs.startTime}
                onChange={(e) =>
                  setInputs((state) => ({ ...state, startTime: e }))
                }
                sx={{
                  "& .MuiInputBase-root": { p: 1 },
                }}
              />
              -
              <TimePicker
                label="종료시간"
                value={inputs.endTime}
                onChange={(e) =>
                  setInputs((state) => ({ ...state, endTime: e }))
                }
                format="a HH:mm"
                sx={{
                  "& .MuiInputBase-root": { p: 1 },
                }}
              />
            </Box>
          </LocalizationProvider>
          <Button
            fullWidth
            endIcon={<>{inputs.place}</>}
            variant="outlined"
            sx={{ p: 1, justifyContent: "space-between", color: "#000" }}
            onClick={() => setPopup((state) => ({ ...state, places: true }))}
          >
            장소
          </Button>
        </Box>
        <Button
          disabled={inputs.name.length === 0}
          fullWidth
          variant="contained"
          sx={{ p: 1 }}
          onClick={editTarget ? update : add}
        >
          {editTarget ? "수정하기" : "추가하기"}
        </Button>
      </Box>
      <Dialog
        open={popup.places}
        onClose={() => setPopup((state) => ({ ...state, places: false }))}
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
          <Button
            variant="contained"
            sx={{ p: 0.5 }}
            onClick={() => setPopup((state) => ({ ...state, places: false }))}
          >
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
                        setInputs((state) => ({ ...state, place: place.name }));
                        setPopup((state) => ({ ...state, places: false }));
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
            onClick={() =>
              setPopup((state) => ({ ...state, places: false, addPlace: true }))
            }
          >
            <AddIcon />
            장소 추가하기
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={popup.addPlace}
        onClose={() => setPopup((state) => ({ ...state, places: false }))}
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
            onClick={() =>
              setPopup((state) => ({ ...state, places: true, addPlace: false }))
            }
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
    </Box>
  );
};

export default SheetCreate;
