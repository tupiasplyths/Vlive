import { Linking, Alert, Platform } from 'react-native';

const openYouTubeVideo = async (videoId: string) => {

    const appURL = `youtube://watch?v=${videoId}`;
    try {
      await Linking.openURL(`vnd.youtube:${videoId}`);
      console.log('Successfully opened with YouTube app');
      return;
  } catch (error) {
    console.error("Lỗi khi mở YouTube:", error);
    Alert.alert("Error");
  }
};

export { openYouTubeVideo };