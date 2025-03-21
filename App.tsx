import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from "@react-navigation/drawer";

import LiveChannels from './components/liveChannels';
import { Input, Flush } from './components/inputs';
import { Search } from './components/search';



const Drawer = createDrawerNavigator();

export default function App() {
	

	return (
	<GestureHandlerRootView>
		<NavigationContainer>
			<Drawer.Navigator>
				<Drawer.Screen name="Home" component={LiveChannels} />
				<Drawer.Screen name="Add Channel" component={Input} />
				<Drawer.Screen name="Search Channel" component={Search} />
				<Drawer.Screen name="Flush Channel List" component={Flush} />
			</Drawer.Navigator>
		</NavigationContainer>
	</GestureHandlerRootView>
	);
}

