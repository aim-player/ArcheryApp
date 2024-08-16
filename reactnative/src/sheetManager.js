import RNFS from 'react-native-fs';
export const createSheet = async (sendMessage, sheet, callbackFn) => {
  try {
    const message = {
      type: 'add_sheet',
      payload: sheet,
    };
    const filePath = `${RNFS.DocumentDirectoryPath}/sheet_${sheet.id}.json`;
    await RNFS.writeFile(filePath, JSON.stringify(sheet), 'utf8');
    sendMessage(JSON.stringify(message));
    console.log('시트 파일 생성 성공: ', filePath);
    await callbackFn();
  } catch (err) {
    console.error('시트 파일 생성 실패: ', err);
  }
};

export const deleteSheets = async (ids = [], callbackFn) => {
  try {
    ids.forEach(async id => {
      const filePath = `${RNFS.DocumentDirectoryPath}/sheet_${id}.json`;
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) await RNFS.unlink(filePath);
    });
    console.log('시트 삭제 성공: ', ids);
    await callbackFn();
  } catch (err) {
    console.error('시트 삭제 실패: ', err);
  }
};
export const updateSheet = async (sheet, callbackFn) => {
  const sheet = message.payload;
  const filePath = `${RNFS.DocumentDirectoryPath}/sheet_${sheet.id}.json`;
  await RNFS.writeFile(filePath, JSON.stringify(sheet), 'utf8');
  await callbackFn();
};
