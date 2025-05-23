import React, { useEffect,useState } from 'react';
import { ActivityIndicator, StyleSheet} from 'react-native';
import {Pressable, Text, View, FlatList, Image, TextInput,TouchableOpacity} from 'react-native';

import { UpdateChannelList, flushList } from '../utils/storage';

import { getChannelID} from '../utils/fetchChannels';



function Search() {
        const [searchQuery, setSearchQuery] = useState('');
        const [channels, setChannels] = useState([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const handleSearch = async () => {
            if (!searchQuery.trim()) {
              setError('Please enter a channel name');
              return;
            }
            
            setLoading(true);
            setError(null);
                
            try {
              // Get raw channel data using getChannelID
              const rawChannelData = await getChannelID(searchQuery);
              
              // Check if we got valid data
              if (!rawChannelData || !Array.isArray(rawChannelData) || rawChannelData.length === 0) {
                setError('No channels found');
                setChannels([]);
                return;
              }
              
              setChannels(rawChannelData);
            const channelsWithKeys = rawChannelData.map((channel, index) => ({
                ...channel,
                key: channel.ChannelIDs || `channel-${index}`
              }));
            setChannels(channelsWithKeys);
            } catch (error) {

              console.error('Error fetching channel data:', error);
              setError(error.message || 'Failed to fetch channels');
              setChannels([]);

            } finally {
              setLoading(false);
            }
          }

          const renderChannelItem = ({ item }) => (
            <TouchableOpacity 
              style={styles.channelItem}
              onPress={() => console.log('Channel selected:', item.ChannelID)}
              >
              <Image 
                source={{ uri: item.channelThumbnail }} 
                style={styles.thumbnail} 
              />
              <View style={styles.channelInfo}>
                <Text style={styles.channelTitle}>{item.channelTitle}</Text>
              </View>
              <TouchableOpacity
                style={styles.add}
                onPress={() => UpdateChannelList(item.ChannelIDs,'add')}
                >
                <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
            </TouchableOpacity>
          );
      return (
        <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search YouTube Channels..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
            disabled={loading}
            >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF0000" />
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <FlatList
          data={channels}
          renderItem={renderChannelItem}
          keyExtractor={item => item.key}
          ListEmptyComponent={
              !loading && !error && channels.length === 0 ? (
              <Text style={styles.emptyText}>
                {searchQuery.trim() ? 'No channels found. Try another search term.' : 'Search for YouTube channels to see results.'}
              </Text>
            ) : null
        }
        />
      </View>
	)

}

const styles = StyleSheet.create({
    add: {
        backgroundColor: '#FF0000',
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
  

export {Search,};