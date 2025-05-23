import { Linking, Alert, Platform } from 'react-native';

const openYouTubeVideo = async (videoId: string) => {
  const appURL = Platform.OS === 'ios' 
    ? `youtube://watch?v=${videoId}` 
    : `vnd.youtube:${videoId}`; 

  const webURL = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const canOpenAppURL = await Linking.canOpenURL(appURL);
    if (canOpenAppURL) {
        console.log(appURL);
      await Linking.openURL(appURL);
    } else {
      const canOpenWebURL = await Linking.canOpenURL(webURL);
      if (canOpenWebURL) {
        await Linking.openURL(webURL);
      } else {
        Alert.alert("Lỗi", "Không thể mở YouTube. Vui lòng kiểm tra cài đặt của bạn.");
      }
    }
  } catch (error) {
    console.error("Lỗi khi mở YouTube:", error);
    Alert.alert("Lỗi", "Đã có lỗi xảy ra khi cố gắng mở YouTube.");
  }
};

export { openYouTubeVideo };