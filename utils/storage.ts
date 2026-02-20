import AsyncStorage from '@react-native-async-storage/async-storage';

async function UpdateChannelList(channelID:string,operation:'add'|'delete' = 'add') : Promise<void> {
    try{
        const channelList = await AsyncStorage.getItem('channels');
        const list : string[] = channelList ? JSON.parse(channelList) : [];
        console.log('Current channel list:', list);
    if(operation === 'add'){
        if (!list.includes(channelID)) {
            list.push(channelID);
            
        }else{
            console.log('Channel already in list:', channelID);
        }
    }else if(operation=== 'delete'){
        console.log('Deleting channel:', channelID);
        const updatedList = list.filter((id) => id !== channelID);
        if(updatedList.length < list.length) {
            console.log('Channel removed from list:', channelID);
            await AsyncStorage.setItem('channels', JSON.stringify(updatedList));
            return;
        }
    }
    await AsyncStorage.setItem('channels', JSON.stringify(list));
    }catch(err){
        console.error('Error updating channel list:', err);
    }
}

async function GetChannelList() {
    return JSON.parse(await AsyncStorage.getItem('channels'));
}

async function flushList() {
    await AsyncStorage.removeItem('channels');
}

export { GetChannelList, UpdateChannelList, flushList };