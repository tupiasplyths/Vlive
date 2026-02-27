import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native'
import { createDrawerNavigator } from "@react-navigation/drawer";
import { TouchableOpacity, Text } from 'react-native';

import LiveChannels from './components/liveChannels';
import { Input, Flush } from './components/inputs';
import { Search } from './components/search';
import ChannelList from './components/channelList';
import Toast from 'react-native-toast-message';


const Drawer = createDrawerNavigator();

const HomeScreenWithRefresh = ({ navigation }: any) => {
	const [refreshKey, setRefreshKey] = React.useState(0);

	const handleRefresh = React.useCallback(() => {
		setRefreshKey(prev => prev + 1);
	}, []);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={handleRefresh}
					style={{ marginRight: 16 }}
				>
					<Text style={{ fontSize: 18 }}>↻</Text>
				</TouchableOpacity>
			),
		});
	}, [navigation, handleRefresh]);

	return <LiveChannels key={refreshKey} />;
};

export default function App() {
	
	return (
	<GestureHandlerRootView style={{ flex: 1 }}>
		<NavigationContainer>
			<Drawer.Navigator>
				<Drawer.Screen name="Home" component={HomeScreenWithRefresh} />
				<Drawer.Screen name="My Channels" component={ChannelList} />
				<Drawer.Screen name="Search Channel" component={Search} />
				<Drawer.Screen name="Add by ID" component={Input} />
				<Drawer.Screen name="Flush" component={Flush} />
			</Drawer.Navigator>
		<Toast />
		</NavigationContainer>
	</GestureHandlerRootView>
	);
}
