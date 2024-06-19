import React from 'react';
import { StyleSheet} from 'react-native';
import { TextInput, View, Pressable, Text} from 'react-native';

import { UpdateChannelList, flushList } from '../utils/storage';

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		// backgroundColor: '#f2ffbf',
		flexDirection: 'row',
		// alignItems: 'flex-inline',
		// justifyContent: 'flex-start',
		// color: 'white',
	},
});

function addId(id:string) {
	UpdateChannelList(id);
} 
function Input() {
	const [id, setId] = React.useState('');


	return (
	<>
		<View style={styles.container}>
			<TextInput
				placeholder="Vtuber Channel ID"
				style={{
					paddingLeft: 4,
					marginLeft: 30,
					marginRight: 10,
					height: 40,
					borderColor: 'gray',
					borderWidth: 1,
					flex: 5,
				}}
				value={id}
				onChange={(e) => setId(e.nativeEvent.text)}
			/>
			<View
				style={{ 
					marginRight: 10,
					flex: 1
				}} 
			>
				<Pressable
					style={{
						backgroundColor: 'blue',
						padding: 10,
						borderRadius: 10,
					}}
					onPress={() => addId(id)}
				>
					<Text style={{ color: 'white', textAlign: 'center',}} >
						Add
					</Text>
				</Pressable>
			</View>
		</View>
	</>
	);
} 

function Flush() {
	function flush() {
		flushList();
	}

	return (
		<Pressable
			style={{
				backgroundColor: 'blue',
				padding: 10,
				borderRadius: 10,
			}}
			onPress={() => flush()}
		>
			<Text style={{ color: 'white', textAlign: 'center',}} >
				Flush
			</Text>
		</Pressable>
	)
}

export {Input, Flush};