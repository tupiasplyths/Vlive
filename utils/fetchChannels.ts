// import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetChannelList } from './storage';

// function updateQueryStringParameter(uri: string, key: string, value: string) :string {
// 	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
// 	var separator = uri.indexOf('?') !== -1 ? "&" : "?";
// 	if (uri.match(re)) {
// 	  return uri.replace(re, '$1' + key + "=" + value + '$2');
// 	}
// 	else {
// 	  return uri + separator + key + "=" + value;
// 	}
// }

function updateQueryStringParameters(uri: string, params: Record<string, string>): string {
    let result = uri;
    const hasQueryString = uri.indexOf('?') !== -1;
    let separator = hasQueryString ? "&" : "?";
    
    Object.entries(params).forEach(([key, value]) => {
        const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        if (result.match(re)) {
            result = result.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            result += separator + key + "=" + value;
            separator = "&";
        }
    });
    
    return result;
}
const HOLODEX_API_KEY = '23979d49-0c44-45f8-9bdb-1058cc51a3f2'
const GG_API_KEY = 'AIzaSyCnR7i_7ROlXQogOZm61uwByfiUmCdv7uc'
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
	let url = updateQueryStringParameters(
		'https://holodex.net/api/v2/users/live', {
			channels:channelIDs.join(',') 	
		}
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
export async function getChannelOtherLive() {
    const channels : string[] = [
		// '@IGN',
		// '@LofiGirl',
		// '@daylaphegame',
	] ;
	const gg_url="https://www.googleapis.com/youtube/v3/search"
	var items: any[] = [];
	try{
		for (const channelname of channels){
			let url = updateQueryStringParameters(gg_url, {
				part: 'snippet',
				q : channelname,
				type: 'video',
				eventType: 'live',
				key: GG_API_KEY,
			});
			console.log('url: ', url);
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			})
				const json = await response.json();
				const channelItems = filterData(json);
				items = [...items, ...channelItems];
			}
			}catch(error){
				console.error(error);
			}
		// console.log("items: ", items);
		return items;
	}

export async function getChannelID(channelName: string) {
	const gg_url="https://www.googleapis.com/youtube/v3/search"
	var channels: any[] = [];
	try{
			let url = updateQueryStringParameters(gg_url, {
				part: 'snippet',
				q : channelName,
				type: 'channel',
				key: GG_API_KEY,
			});
			console.log('url: ', url);
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			})
				const json = await response.json();
				const channelItems = filterId(json);
				channels = [...channels,...channelItems]

			}catch(error){
				console.error(error);
			}
		console.log("items: ", channels);
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
function filterData(json:any) : Array<any> {
	let items:Array<any> = [];
	json.items.forEach(item => {
        if (item.snippet && item.snippet.liveBroadcastContent === 'live') {
            items.push({
                liveBroadcastContent: item.snippet.liveBroadcastContent,
                channelTitle: item.snippet.channelTitle
            });
        }
    });
	return items;
}
function filterId(json:any) : Array<any> {
	let items:Array<any> = [];
	json.items.forEach(item => {
        if (item.snippet) {
            items.push({
				channelTitle: item.snippet.channelTitle,
				channelThumbnail: item.snippet.thumbnails.medium.url,
                ChannelIDs:item.snippet.channelId
            });
        }
    });
	return items;
}
