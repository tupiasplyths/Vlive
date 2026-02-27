import { AddChannel, DeleteChannel } from './storage';
import Toast from 'react-native-toast-message';

const handleDelete = async (channelId: string, loadData?: () => Promise<void>) => {
    try {
        const success = await DeleteChannel(channelId);
        if (success) {
            Toast.show({
                type: 'success',
                text1: 'Deleted',
                text2: 'Channel removed from list',
                position: 'bottom',
            });
            if (loadData) await loadData();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Not Found',
                text2: 'Channel not in list',
                position: 'bottom',
            });
        }
    } catch (error) {
        console.error('Error', error);
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to delete channel',
            position: 'bottom',
        });
    }
};

interface ChannelData {
    id: string;
    name: string;
    thumbnail: string;
}

const handleAdd = async (channelData: ChannelData, type: 'holodex' | 'youtube') => {
    try {
        const success = await AddChannel(channelData.id, channelData.name, channelData.thumbnail, type);
        if (success) {
            Toast.show({
                type: 'success',
                text1: 'Added',
                text2: `${channelData.name} added to ${type} list`,
                position: 'bottom',
            });
        } else {
            Toast.show({
                type: 'info',
                text1: 'Already exists',
                text2: 'Channel is already in your list',
                position: 'bottom',
            });
        }
    } catch (error) {
        console.error('Error', error);
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to add channel',
            position: 'bottom',
        });
    }
};

export { handleDelete, handleAdd };
export type { ChannelData };
