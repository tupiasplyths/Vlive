import { View, Text, FlatList,TouchableOpacity,Image ,StyleSheet,ScrollView, RefreshControl} from 'react-native';
import { useEffect, useState,useCallback } from 'react';

import { getLiveChannels } from '../utils/fetchChannels';
import { GetChannelList, UpdateChannelList } from '../utils/storage';
import { getChannelOtherLive } from '../utils/fetchChannels';
import {openYouTubeVideo} from '../utils/Redirect';
import { handleDelete } from '../utils/ResponseHelper';

const LiveChannels = () : JSX.Element => {
	 const renderChannelItem = ({ item }: { item: any }) => ( 
        <View style={styles.channelItemContainer}> 
            <TouchableOpacity
                style={styles.channelTouchableArea} 
                onPress={() => openYouTubeVideo(item.VideoId)} 
            >
                <Image
                    source={{ uri: item.channelThumbnail }}
                    style={styles.thumbnail}
                />
                <View style={styles.channelInfo}>
                    <Text style={styles.channelTitle}>{item.channelTitle}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(item.ChannelID)} 
                >
                    <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
	const [refreshing, setRefreshing] = useState(false);
	const [channels, setChannels] = useState([]);
	const [items, setOtherLive] = useState<any[]>([]);

		const loadData = useCallback(async () => {
        setRefreshing(true); 
        try {
            const liveChannelsData = await getLiveChannels(); 
            setChannels(liveChannelsData);

            const otherLiveData = await getChannelOtherLive(); 
            setOtherLive(otherLiveData);

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setRefreshing(false);
        }
    }, []); 

    useEffect(() => {
        loadData(); 
    }, [loadData]); 
	return (
		<View style={styles.container}>
            <FlatList
                data={items}
                renderItem={renderChannelItem}
                keyExtractor={(item, index) => item.ChannelID || `channel-${index}`} 
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={loadData} 
                    />
                }
            />
            {}
        </View>
	)
} 
const styles = StyleSheet.create({
    channelItemContainer: {
        flexDirection: 'row', 
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center', 
    },
    channelTouchableArea: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, 
    },
    actionButtonsContainer: {
        flexDirection: 'row', 
    },
    actionButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 10, 
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    actionButtonText: {
        fontSize: 14,
    },
	add: {
		backgroundColor: '#0000ff',
		paddingHorizontal: 12,
		height:30,
		paddingVertical: 6,
		borderRadius: 4,
		marginLeft: 'auto',
		justifyContent: 'center',
		alignItems: 'center',
	  },
	addText: {
		color: 'white',
		fontWeight: 'bold',
	  },
	container: {
	  flex: 1,
	  padding: 16,
	  backgroundColor: '#f5f5f5',
	},
	searchContainer: {
	  flexDirection: 'row',
	  marginBottom: 16,
	},
	searchInput: {
	  flex: 1,
	  height: 50,
	  borderWidth: 1,
	  borderColor: '#ddd',
	  borderRadius: 8,
	  paddingHorizontal: 16,
	  fontSize: 16,
	  backgroundColor: '#fff',
	},
	searchButton: {
	  width: 100,
	  height: 50,
	  backgroundColor: '#FF0000',
	  justifyContent: 'center',
	  alignItems: 'center',
	  borderRadius: 8,
	  marginLeft: 8,
	},
	searchButtonText: {
	  color: '#fff',
	  fontSize: 16,
	  fontWeight: 'bold',
	},
	channelItem: {
	  flexDirection: 'row',
	  padding: 12,
	  backgroundColor: '#fff',
	  borderRadius: 8,
	  marginBottom: 12,
	  shadowColor: '#000',
	  shadowOpacity: 0.1,
	  shadowOffset: { width: 0, height: 2 },
	  shadowRadius: 4,
	  elevation: 2,
	},
	thumbnail: {
	  width: 64,
	  height: 64,
	  borderRadius: 32,
	},
	channelInfo: {
	  flex: 1,
	  marginLeft: 12,
	  justifyContent: 'center',
	},
	channelTitle: {
	  fontSize: 16,
	  fontWeight: 'bold',
	  marginBottom: 4,
	},
	channelDescription: {
	  fontSize: 14,
	  color: '#666',
	},
	loaderContainer: {
	  padding: 20,
	  alignItems: 'center',
	},
	errorContainer: {
	  padding: 16,
	  backgroundColor: '#ffeeee',
	  borderRadius: 8,
	  marginBottom: 16,
	},
	errorText: {
	  color: '#cc0000',
	  textAlign: 'center',
	},
	emptyText: {
	  textAlign: 'center',
	  padding: 20,
	  color: '#666',
	},
  });
  

export default LiveChannels;
