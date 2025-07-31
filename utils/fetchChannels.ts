import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetChannelList, UpdateChannelList } from './storage';
import {HOLODEX_API_KEY} from '@env';

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

export async function getLiveChannels() {
	const channelIDs = await GetChannelList();
	let url = updateQueryStringParameters(
		'https://holodex.net/api/v2/users/live', {
			channels:channelIDs.join(',') 	
		}
	);
	var channels: any[] = [];
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

const GG_API_KEY = 'AIzaSyCnR7i_7ROlXQogOZm61uwByfiUmCdv7uc'

export async function getChannelOtherLive() {
    const channels = await GetChannelList();
	console.log(channels);
	const gg_url="https://www.googleapis.com/youtube/v3/search"
	var items: any[] = [];
	try{
		for (const channelname of channels){
			let url = updateQueryStringParameters(gg_url, {
				part: 'snippet',
				channelId : channelname,
				type: 'video',
				eventType: 'live',
				key: GG_API_KEY,
			});
			console.log(GG_API_KEY);
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
		return channels;
}
export async function getTwitchLiveStatus(channelName: string) {
	const tw_url="https://api.twitch.tv/helix/streams"
	var channels: any[] = [];
	try{
			let url = updateQueryStringParameters(tw_url, {
				user_id : channelName,
				type: 'channel',
				key: GG_API_KEY,
			});
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Client-ID': '', 
					'Authorization':' Bearer ', 
				}
			})
				const json = await response.json();
				const channelItems = filterId(json);
				channels = [...channels,...channelItems]

			}catch(error){
				console.error(error);
			}
		return channels;
}

function filterLiveChannels(json:any) : Array<any> {
	let channels:Array<any> = [];
	for (let i = 0; i < json.length; i++) {
		if (json[i].status === "live") {
			channels.push(json[i]);
		}
	}
	return channels;
}
function filterData(json:any) : Array<any> {
	let items:Array<any> = [];
	json.items.forEach(item => {
        if (item.snippet && item.snippet.liveBroadcastContent === 'live') {
            items.push({
                liveBroadcastContent: item.snippet.liveBroadcastContent,
                channelTitle: item.snippet.channelTitle,
				channelThumbnail: item.snippet.thumbnails.medium.url,
				VideoId: item.id.videoId,
				ChannelID:item.snippet.channelId,
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
