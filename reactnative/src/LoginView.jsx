import React from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

import {useEffect} from 'react';
import {GOOGLE_CLIENT_ID} from '@env';

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    console.log('User signed out successfully');
  } catch (err) {
    console.error('User sign out error', err);
  }
};

const LoginView = ({open, close, sendMessage}) => {
  const tryLogin = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      sendMessage('login/success', userInfo);
      close();
    } catch (err) {
      console.error('try login: ', err);
    }
  };
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
    });
  }, []);
  return (
    <Modal
      visible={open}
      animationType="fade"
      onRequestClose={close}
      transparent>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.closeArea}
          onPressOut={close}
          activeOpacity={1}
        />
        <View style={styles.content}>
          <View style={styles.modal_header}>
            <Text style={[styles.text, styles.title]}>로그인</Text>
            <TouchableOpacity onPress={close} style={styles.btn_close}>
              <Text style={styles.text}>닫기</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.login_methods}>
            <GoogleSigninButton
              onPress={tryLogin}
              style={styles.btn_login}
              size={GoogleSigninButton.Size.Wide}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default LoginView;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'flex-end'},
  closeArea: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)'},
  content: {
    height: '20%',
    backgroundColor: '#fff',
  },
  modal_header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  btn_close: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  login_methods: {
    flex: 1,
    width: '100%',
    padding: 16,
  },
  btn_login: {width: '100%'},
  title: {fontSize: 18, fontWeight: 'bold'},
  text: {color: '#000'},
});
