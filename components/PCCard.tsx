import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { wakePC, checkPCStatus } from '../utils/pcApi';

type Status = 'online' | 'offline' | 'checking';

interface PCCardProps {
  name: string;
  status: Status;
  onStatusChange: (name: string, status: Status) => void;
}

export const PCCard: React.FC<PCCardProps> = ({ name, status, onStatusChange }) => {
  const [isWaking, setIsWaking] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);

  const handleWake = async () => {
    setIsWaking(true);
    try {
      await wakePC(name);
      onStatusChange(name, 'checking');
      setTimeout(() => {
        handleCheckStatus();
      }, 3000);
    } catch (error) {
      console.error('Wake error:', error);
      onStatusChange(name, 'offline');
    } finally {
      setIsWaking(false);
    }
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    onStatusChange(name, 'checking');
    try {
      const result = await checkPCStatus(name);
      onStatusChange(name, result.status ? 'online' : 'offline');
    } catch (error) {
      console.error('Status check error:', error);
      onStatusChange(name, 'offline');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#28a745';
      case 'offline': return '#dc3545';
      case 'checking': return '#ffc107';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'checking': return 'Checking...';
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.wakeButton]}
          onPress={handleWake}
          disabled={isWaking || status === 'online'}
        >
          {isWaking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Wake Up</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.checkButton]}
          onPress={handleCheckStatus}
          disabled={isChecking}
        >
          {isChecking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Check Status</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'currentColor',
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wakeButton: {
    backgroundColor: '#28a745',
  },
  checkButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
