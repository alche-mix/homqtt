var fs = require('fs');
var path = require('path');
var storage = require('node-persist');
var uuid = require('HAP-NodeJS').uuid;
var Bridge = require('HAP-NodeJS').Bridge;
var Accessory = require('HAP-NodeJS').Accessory;
var Service = require('HAP-NodeJS').Service;
var Characteristic = require('HAP-NodeJS').Characteristic;
var accessoryLoader = require('HAP-NodeJS/lib/AccessoryLoader');

console.log("HAP-NodeJS starting...");

// Initialize our storage system
storage.initSync();

// Start by creating our Bridge which will host all loaded Accessories
var bridge = new Bridge('Node Bridge', uuid.generate("Node Bridge"));
//bridge.username = "C1:5D:3A:AE:5E:FA";
//bridge.pincode = "031-45-154";

// Listen for bridge identification event
bridge.on('identify', function(paired, callback) {
  console.log("Node Bridge identify");
  callback(); // success
});

// Load up all accessories in the /accessories folder
var dir = path.join(__dirname, "accessories");
var accessories = accessoryLoader.loadDirectory(dir);

// Add them all to the bridge
accessories.forEach(function(accessory) {
  bridge.addBridgedAccessory(accessory);
});

var ac = new Accessory("Temperatur", uuid.generate('Temp'));
ac.username = "C1:5D:3A:AE:5E:FB";
ac.pincode = "031-45-155";
ac
  .addService(Service.TemperatureSensor)
  .getCharacteristic(Characteristic.CurrentTemperature)
  .on('get', function(callback) {
    console.log("get");
    callback(null, 24);
  });;


bridge.addBridgedAccessory(ac);


// Publish the Bridge on the local network.
bridge.publish({
  username: "CC:22:3D:E3:CE:F6",
  port: 51826,
  pincode: "031-45-154",
  category: Accessory.Categories.BRIDGE
});
