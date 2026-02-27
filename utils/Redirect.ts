import { Linking, Alert } from 'react-native';

const openYouTubeVideo = async (videoId: string) => {
    if (!videoId) {
        console.error('openYouTubeVideo: videoId is empty or undefined');
        Alert.alert('Error', 'Invalid video ID');
        return;
    }

    const appURL = `youtube://watch?v=${videoId}`;
    const webURL = `https://www.youtube.com/watch?v=${videoId}`;

    try {
        // Check if YouTube app can handle the URL
        const canOpenApp = await Linking.canOpenURL(appURL);
        
        if (canOpenApp) {
            await Linking.openURL(appURL);
            console.log('Successfully opened with YouTube app');
        } else {
            // Fallback to browser
            console.log('YouTube app not available, opening in browser...');
            await Linking.openURL(webURL);
        }
    } catch (error) {
        console.error('Error opening YouTube:', error);
        // Final fallback: try browser URL
        try {
            await Linking.openURL(webURL);
        } catch (browserError) {
            console.error('Failed to open browser URL:', browserError);
            Alert.alert('Error', 'Unable to open video. Please try again later.');
        }
    }
};

export { openYouTubeVideo };