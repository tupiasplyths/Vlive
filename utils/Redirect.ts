import { Linking, Alert, Platform } from 'react-native';

const openYouTubeVideo = async (videoId: string) => {

    const appURL = `youtube://watch?v=${videoId}`;

  // const webURL = `https://www.youtube.com/watch?v=${videoId}`;

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
        Alert.alert("Lỗi", "Me can't open Youtube app for you");
      }
    }
  } catch (error) {
    console.error("Lỗi khi mở YouTube:", error);
    Alert.alert("Error");
  }
};

export { openYouTubeVideo };