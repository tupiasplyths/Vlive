import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Channel {
    id: string;
    name: string;
    thumbnail: string;
    type: 'holodex' | 'youtube';
    addedAt: number;
}

async function MigrateOldData(): Promise<void> {
    try {
        const oldData = await AsyncStorage.getItem('channels');
        if (!oldData) return;
        
        const parsed = JSON.parse(oldData);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
            const migrated: Channel[] = parsed.map((id: string) => ({
                id,
                name: 'Unknown Channel',
                thumbnail: '',
                type: 'youtube' as const,
                addedAt: Date.now(),
            }));
            await AsyncStorage.setItem('channels', JSON.stringify(migrated));
            console.log('Migrated old channel data');
        }
    } catch (err) {
        console.error('Error migrating data:', err);
    }
}

async function GetChannelList(): Promise<Channel[]> {
    try {
        await MigrateOldData();
        const data = await AsyncStorage.getItem('channels');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error('Error getting channel list:', err);
        return [];
    }
}

async function AddChannel(id: string, name: string, thumbnail: string, type: 'holodex' | 'youtube'): Promise<boolean> {
    try {
        const list = await GetChannelList();
        if (list.some(ch => ch.id === id)) {
            console.log('Channel already in list:', id);
            return false;
        }
        list.push({
            id,
            name,
            thumbnail,
            type,
            addedAt: Date.now(),
        });
        await AsyncStorage.setItem('channels', JSON.stringify(list));
        return true;
    } catch (err) {
        console.error('Error adding channel:', err);
        return false;
    }
}

async function DeleteChannel(id: string): Promise<boolean> {
    try {
        const list = await GetChannelList();
        const filtered = list.filter(ch => ch.id !== id);
        if (filtered.length < list.length) {
            await AsyncStorage.setItem('channels', JSON.stringify(filtered));
            return true;
        }
        return false;
    } catch (err) {
        console.error('Error deleting channel:', err);
        return false;
    }
}

async function GetChannelIDs(): Promise<string[]> {
    const list = await GetChannelList();
    return list.map(ch => ch.id);
}

async function flushList(): Promise<void> {
    await AsyncStorage.removeItem('channels');
}

export { GetChannelList, AddChannel, DeleteChannel, GetChannelIDs, flushList };
