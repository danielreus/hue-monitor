const {fiber, await, defer} = require('synchronize');
const request = require('request');
const HueLib = require("node-hue-api"); 
const HueApi = HueLib.HueApi;
const hue = new HueApi();

const sensors = require('./sensors')

function displayBridges(bridge) {
	console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};


const cache = {};

// --------------------------
// Using a callback
const appDescription = "local sensor monitor";
let bridgeIp = null; //'192.168.10.101';
let bridgeToken = '5BFN7geC06ONzsN01elyLPGuOdmblzKm6ZQIlxWI';

fiber(function () {
	if (!bridgeIp) {
		const result = await(HueLib.nupnpSearch(defer()));
		bridgeIp = result[0]['ipaddress'];
		console.log('bridgeIp', bridgeIp);
	}
	if (!bridgeToken) {
		for (let i = 20; i && !bridgeToken; --i) {
			console.log('please press the button on the Hue bridge. Seconds left: ' + i);
			await(setTimeout(defer(), 1000));
			try {
				bridgeToken = await(hue.registerUser(bridgeIp, appDescription, defer()));
			} catch (_) {}
			if (bridgeToken) {
				break;
			}
		}
		console.log('token: ' + bridgeToken);
	}

	if (bridgeToken && bridgeIp) {
		const hueApi = new HueApi(bridgeIp, bridgeToken);
		setInterval(function(){
			fiber(function() {
				const sensorStatus = await(hueApi.sensors(defer()));
				// console.log(JSON.stringify(sensorStatus, null, 2));
				sensorStatus.sensors.forEach(function(sensorInfo) {
					// console.log('info for sensor ' + sensorInfo.id);
					const subscription = sensors[sensorInfo.id];
					if (subscription) {
						const newValue = sensorInfo.state[subscription.stateName];
						const oldValue = cache[sensorInfo.id];
						if (newValue !== oldValue) {
							let converted = newValue;
							if (converted === false) converted = 0;
							else if (converted === true) converted = 1;
							console.log('value for ' + sensorInfo.id + ' ' + subscription.stateName +  ' state: ' + converted + ' ; report to ' + subscription.url);
							cache[sensorInfo.id] = newValue;
							request.post({url: subscription.url + '?value=' + converted}, function(){console.log('posted');});
						}

					}
				});
			}, function(err) {
				if (err) {
					console.log(err);
				}
			});

		}, 1000);
	}

	// const bridgeState = await(hueApi.getConfig(defer()));
	// console.log(JSON.stringify(bridgeState, null, 2));
}, function (err) {
	if (err) {
		console.log(err);
	}
});
