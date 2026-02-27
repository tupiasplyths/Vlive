import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { TextInput, View, Pressable, Text } from 'react-native';

import { handleAdd } from '../utils/ResponseHelper';
import { getChannelInfo } from '../utils/fetchChannels';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    typeSelector: {
        flexDirection: 'row',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 4,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    typeButtonActive: {
        backgroundColor: '#3366ff',
        borderColor: '#3366ff',
    },
    typeButtonText: {
        fontSize: 13,
        color: '#333',
    },
    typeButtonTextActive: {
        color: '#fff',
    },
});

function Input() {
    const [id, setId] = useState('');
    const [type, setType] = useState<'holodex' | 'youtube'>('youtube');
    const [loading, setLoading] = useState(false);

    const addId = async () => {
        if (!id.trim()) return;
        setLoading(true);
        try {
            const channelInfo = await getChannelInfo(id.trim());
            if (channelInfo) {
                handleAdd(channelInfo, type);
                setId('');
            } else {
                console.log('Channel not found');
            }
        } catch (error) {
            console.error('Error adding channel:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <View style={styles.typeSelector}>
                <Pressable
                    style={[styles.typeButton, type === 'holodex' && styles.typeButtonActive]}
                    onPress={() => setType('holodex')}
                >
                    <Text style={[styles.typeButtonText, type === 'holodex' && styles.typeButtonTextActive]}>
                        Holodex
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.typeButton, type === 'youtube' && styles.typeButtonActive]}
                    onPress={() => setType('youtube')}
                >
                    <Text style={[styles.typeButtonText, type === 'youtube' && styles.typeButtonTextActive]}>
                        YouTube
                    </Text>
                </Pressable>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
                <TextInput
                    placeholder="Channel ID"
                    style={{
                        paddingLeft: 8,
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1,
                        flex: 5,
                        borderRadius: 6,
                        backgroundColor: '#fff',
                    }}
                    value={id}
                    onChangeText={setId}
                />
                <View style={{ marginLeft: 8, flex: 1 }}>
                    <Pressable
                        style={{
                            backgroundColor: '#3366ff',
                            padding: 10,
                            borderRadius: 6,
                            alignItems: 'center',
                        }}
                        onPress={addId}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={{ color: 'white', fontWeight: '600' }}>Add</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </>
    );
}

function Flush() {
    const { flushList } = require('../utils/storage');
    
    function flush() {
        flushList();
    }

    return (
        <View style={{ padding: 16 }}>
            <Pressable
                style={{
                    backgroundColor: '#ff4444',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                }}
                onPress={() => flush()}
            >
                <Text style={{ color: 'white', fontWeight: '600' }}>
                    Clear All Channels
                </Text>
            </Pressable>
        </View>
    );
}

export { Input, Flush };
