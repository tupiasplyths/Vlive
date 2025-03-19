import AsyncStorage from '@react-native-async-storage/async-storage';

async function UpdateChannelList(channelID:string) : Promise<void> {
    let list = [];
    await AsyncStorage.getItem('channels').then((res) => {
        if (res) list = JSON.parse(res);
    }).catch((err) => console.log(err));
    list.push(channelID);
    AsyncStorage.setItem('channels', JSON.stringify(list));
    return;
}

async function GetChannelList() {
    return JSON.parse(await AsyncStorage.getItem('channels'));
}

async function flushList() {
    await AsyncStorage.removeItem('channels');
}

export { GetChannelList, UpdateChannelList, flushList };