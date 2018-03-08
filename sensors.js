// Configure where to report each value by making entries as follows: sensorId: {stateName: 'nameOfState', url: 'urlWhereToPost'}
module.exports = {
	// Living room
	3: {stateName: 'temperature', url: 'https://your.server/temp1'}, //or: https://connect.triggi.com/c/yourConnectorIdForTemperature, etc
	4: {stateName: 'presence', url: 'https://your.server/pres1'},
	5: {stateName: 'lightlevel', url: 'https://your.server/light1'},
	6: {stateName: 'status', url: 'https://your.server/status11'},
	// Hallway
	7: {stateName: 'temperature', url: 'https://your.server/temp2'},
	8: {stateName: 'presence', url: 'https://your.server/pres2'},
	9: {stateName: 'lightlevel', url: 'https://your.server/light2'},
	10: {stateName: 'status', url: 'https://your.server/status2'},
};
