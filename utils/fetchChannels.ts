// import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetChannelList } from './storage';
function updateQueryStringParameter(uri: string, key: string, value: string) :string {
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	if (uri.match(re)) {
	  return uri.replace(re, '$1' + key + "=" + value + '$2');
	}
	else {
	  return uri + separator + key + "=" + value;
	}
}

const HOLODEX_API_KEY = '23979d49-0c44-45f8-9bdb-1058cc51a3f2'
export async function getLiveChannels() {
	// const channelIDs :string[] = [
	// 	'UCdyqAaZDKHXg4Ahi7VENThQ',
	// 	'UCJFZiqLMntJufDCHc6bQixg',
	// 	'UCim0N3tvLijU_I3jbJeJV8g',
	// 	'UC6eWCld0KwmyHFbAqK3V-Rw',
	// 	'UCFKOVgVbGmX65RxO3EtH3iw',
	// 	'UCV5ZZlLjk5MKGg3L0n0vbzw',
	// ];
	const channelIDs = await GetChannelList();
	let url = updateQueryStringParameter(
		'https://holodex.net/api/v2/users/live', 
		'channels', 
		channelIDs.join(',')
	);
	var channels: any[] = [];
	console.log('url: ', url);
	await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-APIKEY': HOLODEX_API_KEY,
		}
	}).then((response) => response.json())
	.then((json) => {
		channels = filterLiveChannels(json);
	})
	.catch((error) => {
		console.error(error);
	});
	return channels;
}

function filterLiveChannels(json:any) : Array<any> {
	let channels:Array<any> = [];
	for (let i = 0; i < json.length; i++) {
		if (json[i].status === "live") {
			channels.push(json[i]);
		}
	}
	console.log("number of live channels: ", channels.length);
	return channels;
}