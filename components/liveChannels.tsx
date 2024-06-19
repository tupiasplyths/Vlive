import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

import { getLiveChannels } from '../utils/fetchChannels';
import { GetChannelList } from '../utils/storage';

const LiveChannels = () : JSX.Element => {
	const [channels, setChannels] = useState([]);
	const [ids, setIds] = useState([]);
	
	useEffect(() => {
		async function data() {
			let tmp = await getLiveChannels();
			setChannels(tmp);
		} 
		async function getList() {
			let json = await GetChannelList();
			setIds(json);
		}
		data();
		getList();
	}, [])
	return (
		<View>
			<Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 30}}>List of channels that are live: </Text>

			<FlatList
				data={channels}
				renderItem={({item}) => <Text>{item.channel.name}</Text>}
				
			/>

			<Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 30}}>Channel ID list </Text>

			<FlatList
				data={ids}
				renderItem={({item}) => <Text>{item}</Text>}
				
			/>
		</View>

	)
} 

export default LiveChannels;