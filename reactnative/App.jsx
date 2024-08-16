import React, {useEffect, useRef, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';

const sheetIdsFilePath = `${RNFS.DocumentDirectoryPath}/sheet_ids.json`;
const placesFilePath = `${RNFS.DocumentDirectoryPath}/places.json`;

const App = () => {
  const webviewRef = useRef();
  const initialized = useRef(false);
  const [sheetIds, setSheetIds] = useState([]);
  const [places, setPlaces] = useState([]);

  const sendAlert = message => {
    webviewRef.current.postMessage(
      JSON.stringify({type: 'alert', payload: {message}}),
    );
  };

  const initialize = async () => {
    let fileExists;
    try {
      fileExists = await RNFS.exists(sheetIdsFilePath);
      if (!fileExists) {
        await RNFS.writeFile(sheetIdsFilePath, JSON.stringify([]), 'utf8');
        console.log('빈 파일이 생성되었습니다:', sheetIdsFilePath);
      } else {
        const fileData = await RNFS.readFile(sheetIdsFilePath, 'utf8');
        setSheetIds(JSON.parse(fileData));
        console.log('ids 파일이 존재합니다 ', fileData);
      }
      fileExists = await RNFS.exists(placesFilePath);
      if (!fileExists)
        await RNFS.writeFile(placesFilePath, JSON.stringify([]), 'utf8');
      else {
        const fileData = await RNFS.readFile(placesFilePath, 'utf8');
        setPlaces(JSON.parse(fileData));
      }
      initialized.current = true;
    } catch (err) {
      console.error('파일 생성 실패:', err);
    }
  };

  const loadData = async () => {
    try {
      const data = await RNFS.readFile(sheetIdsFilePath, 'utf8');
      const ids = JSON.parse(data);
      const payload = await Promise.all(
        ids.map(async (id, idx) => {
          const path = `${RNFS.DocumentDirectoryPath}/sheet_${id}.json`;
          const exists = await RNFS.exists(path);
          if (exists) {
            const sheetFileData = await RNFS.readFile(
              `${RNFS.DocumentDirectoryPath}/sheet_${id}.json`,
              'utf8',
            );
            return JSON.parse(sheetFileData);
          } else {
            ids.pop(idx);
            return null;
          }
        }),
      );
      setSheetIds(ids);

      const message = {
        type: 'load',
        payload: {sheets: payload.filter(e => Boolean(e)), places},
      };
      webviewRef.current.postMessage(JSON.stringify(message));
    } catch (err) {
      console.error('데이터 로드 실패: ', err);
    }
  };

  const loadPlaces = async () => {
    const message = {
      type: 'load',
      payload: {places},
    };
    webviewRef.current.postMessage(JSON.stringify(message));
  };

  const deleteSheets = async (ids = []) => {
    try {
      ids.forEach(async id => {
        const filePath = `${RNFS.DocumentDirectoryPath}/sheet_${id}.json`;
        const fileExists = await RNFS.exists(filePath);
        if (fileExists) await RNFS.unlink(filePath);
      });
      console.log('시트 삭제 성공: ', ids);
      loadData();
    } catch (err) {
      console.error('시트 삭제 실패: ', err);
    }
  };

  const handleMessage = async event => {
    const message = JSON.parse(event.nativeEvent.data);
    if (message.type === 'add_sheet') {
      const sheet = message.payload;
      setSheetIds(state => [...state, sheet.id]);
      await createSheet(sheet);
      await loadData();
    } else if (message.type === 'update_sheet') {
      const sheet = message.payload;
      const filePath = `${RNFS.DocumentDirectoryPath}/sheet_${sheet.id}.json`;
      await RNFS.writeFile(filePath, JSON.stringify(sheet), 'utf8');
      sendAlert('시트 정보를 수정했어요.');
      await loadData();
    } else if (message.type === 'delete_sheet') {
      const payload = message.payload;
      setSheetIds(state => state.filter(id => id !== payload.id));
      deleteSheets([payload.id]);
    } else if (message.type === 'update_places') {
      const payload = message.payload;
      setPlaces(payload);
    } else if (message.type === 'load') {
      await initialize();
      await loadData();
      // const data = await readDataFromFile();
      // message.data = data;
      // const fileStat = await RNFS.stat(filePath);
      // const fileSize = fileStat.size; // 파일 크기 (바이트 단위)
      // console.log(`파일 크기: ${fileSize} bytes`);
      // message.data.fileSize = fileSize;
      // webviewRef.current.injectJavaScript(`
      //     window.onDataLoaded(${JSON.stringify(message)})`);
    } else if (message.type === 'reset') {
      deleteSheets(sheetIds);
      setSheetIds([]);
    } else if (message.type === 'log') {
      console.log('LOG ===== ' + JSON.stringify(message.data));
    }
  };

  const createSheet = async sheet => {
    try {
      const message = {
        type: 'add_sheet',
        payload: sheet,
      };
      const filePath = `${RNFS.DocumentDirectoryPath}/sheet_${sheet.id}.json`;
      await RNFS.writeFile(filePath, JSON.stringify(sheet), 'utf8');

      webviewRef.current.postMessage(JSON.stringify(message));
      console.log('시트 파일 생성 성공: ', filePath);
    } catch (err) {
      console.error('시트 파일 생성 실패: ', err);
    }
  };

  const saveSheetIds = async () => {
    try {
      await RNFS.writeFile(sheetIdsFilePath, JSON.stringify(sheetIds), 'utf8');
    } catch (err) {
      console.error('시트 IDs 저장 실패: ', err);
    }
  };

  const savePlaces = async () => {
    try {
      await RNFS.writeFile(placesFilePath, JSON.stringify(places), 'utf8');
      loadPlaces();
    } catch (err) {
      console.error('장소 저장 실패: ', err);
    }
  };

  useEffect(() => {
    initialize(); // 컴포넌트가 마운트될 때 호출
    console.log('React Native is mounted');
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    saveSheetIds();
  }, [sheetIds]);
  useEffect(() => {
    if (!initialized.current) return;
    savePlaces();
  }, [places]);
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webviewRef}
        style={styles.webview}
        source={{uri: 'http://localhost:3000'}}
        onMessage={handleMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default App;
