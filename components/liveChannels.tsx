import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

import { getLiveChannels } from '../utils/fetchChannels';
import { GetChannelList } from '../utils/storage';
import { getChannelOtherLive } from '../utils/fetchChannels';

const LiveChannels = () : JSX.Element => {
	const [channels, setChannels] = useState([]);
	const [ids, setIds] = useState([]);
	const [items, setOtherLive] = useState<any[]>([]);

	console.log(items)

	useEffect(() => {
		async function data() {
			let tmp = await getLiveChannels();
			setChannels(tmp);
		} 
		async function getList() {
			let json = await GetChannelList();
			setIds(json);
		}
		async function getOtherLive() {
			let tmp = await getChannelOtherLive();
			setOtherLive(tmp);
		}
		getOtherLive();
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

			<Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 30}}>List of non homolive channels that are live: </Text>

			<FlatList
				data={items}
				renderItem={({item}) => <Text>{item.channelTitle}</Text>}
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