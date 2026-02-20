import { GetChannelList, UpdateChannelList } from '../utils/storage';
import Toast from 'react-native-toast-message';

  const handleDelete = async (channelId, Loadata) => {
    try {
      await UpdateChannelList(channelId, 'delete');

      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Gone',
        position: 'bottom',
      });
      await Loadata();
    } catch (error) {
      console.error("Error", error);
      Toast.show({
        type: 'error',
        text1: 'i dont know how',
        text2: 'i hate front end',
        position: 'bottom',
      });
    }
  };

const handleAdd = async (channelId) => {
  try {
    await UpdateChannelList(channelId, 'add');

    Toast.show({
      type: 'success',
      text1: 'Added',
      text2: 'Go Home',
      position: 'bottom',
    });

  } catch (error) {
    console.error("Error", error);
    Toast.show({
      type: 'error',
      text1: 'i dont know how',
      text2: 'i hate front end',
      position: 'bottom',
    });
  }
};
export { handleDelete,handleAdd };