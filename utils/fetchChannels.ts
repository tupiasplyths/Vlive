import { GetChannelIDs } from './storage';
import { HOLODEX_API_KEY, GG_API_KEY, TWITCH_CLIENT_ID, TWITCH_ACCESS_TOKEN } from '@env';

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
	const channelIDs = await GetChannelIDs();
	let url = updateQueryStringParameters(
		'https://holodex.net/api/v2/users/live', {
		channels: channelIDs.join(',')
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



export async function getChannelOtherLive() {
	const channels = await GetChannelIDs();
	console.log(channels);
	const gg_url = "https://www.googleapis.com/youtube/v3/search"
	var items: any[] = [];
	try {
		for (const channelname of channels) {
			let url = updateQueryStringParameters(gg_url, {
				part: 'snippet',
				channelId: channelname,
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
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const json = await response.json();
			const channelItems = filterData(json);
			items = [...items, ...channelItems];
		}
	} catch (error) {
		console.error(error);
	}
	return items;
}

export async function getChannelID(channelName: string) {
	const gg_url = "https://www.googleapis.com/youtube/v3/search"
	var channels: any[] = [];
	try {
		let url = updateQueryStringParameters(gg_url, {
			part: 'snippet',
			q: channelName,
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
		channels = [...channels, ...channelItems]

	} catch (error) {
		console.error(error);
	}
	return channels;
}

export async function getChannelInfo(channelId: string): Promise<{ id: string; name: string; thumbnail: string } | null> {
	const gg_url = "https://www.googleapis.com/youtube/v3/channels";
	try {
		let url = updateQueryStringParameters(gg_url, {
			part: 'snippet',
			id: channelId,
			key: GG_API_KEY,
		});
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const json = await response.json();
		if (json.items && json.items.length > 0) {
			const item = json.items[0];
			return {
				id: item.id,
				name: item.snippet.title,
				thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
			};
		}
		return null;
	} catch (error) {
		console.error('Error fetching channel info:', error);
		return null;
	}
}
export async function getTwitchLiveStatus(channelName: string) {
	const tw_url = "https://api.twitch.tv/helix/streams"
	var channels: any[] = [];
	try {
		let url = updateQueryStringParameters(tw_url, {
			user_id: channelName,
			type: 'channel',
		});
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Client-ID': TWITCH_CLIENT_ID,
				'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`,
			}
		})
		const json = await response.json();
		const channelItems = filterId(json);
		channels = [...channels, ...channelItems]

	} catch (error) {
		console.error(error);
	}
	return channels;
}

function filterLiveChannels(json: any): Array<any> {
	let channels: Array<any> = [];
	for (let i = 0; i < json.length; i++) {
		if (json[i].status === "live") {
			channels.push(json[i]);
		}
	}
	return channels;
}
function filterData(json: any): Array<any> {
	let items: Array<any> = [];
	json.items.forEach(item => {
		if (item.snippet && item.snippet.liveBroadcastContent === 'live') {
			items.push({
				liveBroadcastContent: item.snippet.liveBroadcastContent,
				channelTitle: item.snippet.channelTitle,
				channelThumbnail: item.snippet.thumbnails?.medium?.url
					|| item.snippet.thumbnails?.default?.url
					|| '',
				VideoId: item.id.videoId,
				ChannelID: item.snippet.channelId,
			});
		}
	});
	return items;
}
function filterId(json: any): Array<any> {
	let items: Array<any> = [];
	json.items.forEach(item => {
		if (item.snippet) {
			items.push({
				channelTitle: item.snippet.channelTitle,
				channelThumbnail: item.snippet.thumbnails?.medium?.url
					|| item.snippet.thumbnails?.default?.url
					|| '',
				ChannelIDs: item.snippet.channelId
			});
		}
	});
	return items;
}
