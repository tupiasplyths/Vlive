import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from "@react-navigation/drawer";

import LiveChannels from './components/liveChannels';
import { Input, Flush } from './components/inputs';
import { Search } from './components/search';
import Toast from 'react-native-toast-message';


const Drawer = createDrawerNavigator();

export default function App() {
	

	return (
	<GestureHandlerRootView style={{ flex: 1 }}>
		<NavigationContainer>
			<Drawer.Navigator>
				<Drawer.Screen name="Home" component={LiveChannels} />
				<Drawer.Screen name="Search Channel" component={Search} />
			</Drawer.Navigator>
		</NavigationContainer>
		<Toast />
	</GestureHandlerRootView>
	);
}

