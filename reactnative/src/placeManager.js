import RNFS from 'react-native-fs';
export const createSheet = async (sendMessage, sheet) => {
  try {
    const message = {
      type: 'add_sheet',
      payload: sheet,
    };
    const filePath = `${RNFS.DocumentDirectoryPath}/sheet_${sheet.id}.json`;
    await RNFS.writeFile(filePath, JSON.stringify(sheet), 'utf8');
    sendMessage(JSON.stringify(message));
    console.log('시트 파일 생성 성공: ', filePath);
  } catch (err) {
    console.error('시트 파일 생성 실패: ', err);
  }
};
