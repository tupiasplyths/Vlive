import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PCCard } from './PCCard';
import { checkPCStatus } from '../utils/pcApi';

type PCStatusMap = {
  [key: string]: 'online' | 'offline' | 'checking';
};

const PCS = ['Phere', 'Duong'];

const PCControl: React.FC = () => {
  const [statuses, setStatuses] = useState<PCStatusMap>({
    Phere: 'checking',
    Duong: 'checking',
  });
  const [refreshing, setRefreshing] = useState(false);

  const checkAllStatuses = useCallback(async () => {
    setRefreshing(true);
    const newStatuses: PCStatusMap = {};

    await Promise.all(
      PCS.map(async (pc) => {
        newStatuses[pc] = 'checking';
        setStatuses({ ...newStatuses });
        try {
          const result = await checkPCStatus(pc);
          newStatuses[pc] = result.status ? 'online' : 'offline';
        } catch (error) {
          newStatuses[pc] = 'offline';
        }
      })
    );

    setStatuses(newStatuses);
    setRefreshing(false);
  }, []);

  const handleStatusChange = useCallback((pcName: string, status: 'online' | 'offline' | 'checking') => {
    setStatuses(prev => ({
      ...prev,
      [pcName]: status,
    }));
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkAllStatuses();
      const interval = setInterval(checkAllStatuses, 30000);
      return () => clearInterval(interval);
    }, [checkAllStatuses])
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={checkAllStatuses}
          />
        }
      >
        <Text style={styles.header}>PC Control Panel</Text>
        {PCS.map(pc => (
          <PCCard
            key={pc}
            name={pc}
            status={statuses[pc]}
            onStatusChange={handleStatusChange}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default PCControl;
