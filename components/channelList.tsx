import { View, Text, TouchableOpacity, Image, StyleSheet, RefreshControl, SectionList } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { GetChannelList, Channel } from '../utils/storage';
import { handleDelete } from '../utils/ResponseHelper';

const ChannelList = (): React.JSX.Element => {
    const [refreshing, setRefreshing] = useState(false);
    const [holodexChannels, setHolodexChannels] = useState<Channel[]>([]);
    const [youtubeChannels, setYoutubeChannels] = useState<Channel[]>([]);

    const loadData = useCallback(async () => {
        setRefreshing(true);
        try {
            const channels = await GetChannelList();
            setHolodexChannels(channels.filter(ch => ch.type === 'holodex'));
            setYoutubeChannels(channels.filter(ch => ch.type === 'youtube'));
        } catch (error) {
            console.error('Error loading channels:', error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const onDelete = async (channelId: string) => {
        await handleDelete(channelId, loadData);
    };

    const renderChannelItem = (item: Channel) => (
        <View style={styles.channelItemContainer}>
            <View style={styles.channelTouchableArea}>
                {item.thumbnail ? (
                    <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                ) : (
                    <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
                        <Text style={styles.placeholderText}>{item.name.charAt(0).toUpperCase()}</Text>
                    </View>
                )}
                <View style={styles.channelInfo}>
                    <Text style={styles.channelTitle} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.channelId} numberOfLines={1}>{item.id}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(item.id)}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    const sections = [
        { title: 'Holodex Channels', data: holodexChannels },
        { title: 'YouTube Channels', data: youtubeChannels },
    ];

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderChannelItem(item)}
                renderSectionHeader={({ section }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>{section.title}</Text>
                        <Text style={styles.sectionCount}>{section.data.length}</Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadData} />
                }
                ListEmptyComponent={
                    !refreshing && (
                        <Text style={styles.emptyText}>No channels followed yet</Text>
                    )
                }
                contentContainerStyle={holodexChannels.length === 0 && youtubeChannels.length === 0 ? styles.emptyContainer : undefined}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionCount: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        backgroundColor: '#ccc',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    channelItemContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    channelTouchableArea: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    thumbnail: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    placeholderThumbnail: {
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
    },
    channelInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    channelTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    channelId: {
        fontSize: 12,
        color: '#888',
    },
    deleteButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#ff4444',
        borderRadius: 4,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
        padding: 40,
        color: '#999',
        fontSize: 16,
    },
});

export default ChannelList;
