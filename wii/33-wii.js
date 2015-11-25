module.exports = function(RED) {
    "use strict";
    var wiiController = require('wii-controller');
    var wii = new wiiController();
	
    function WiiNode(n) {
        RED.nodes.createNode(this, n);
        this.topic = n.topic;
        var node = this;

        wii.on("CWIID_BTN_1:press", function(key) {
            //node.log("CWIID_BTN_1 press");
            var msg = {'topic': node.topic + '/key'};
            msg.payload = {'key': '1'};
            node.send(msg);
        });

        wii.on("CWIID_BTN_2:press", function(key) {
            //node.log("CWIID_BTN_2 press");
            var msg = {'topic': node.topic + '/key'};
            msg.payload = {'key': '2'};
            node.send(msg);
        });

        wii.on("CWIID_BTN_HOME:press", function(key) {
            //node.log("CWIID_BTN_HOME press");
        });

        wii.on("CWIID_BTN_LEFT:press", function(key) {
            //node.log("CWIID_BTN_LEFT press (left)");
            var msg = {'topic': node.topic + '/key'};
            msg.payload = {'key': 'left'};
            node.send(msg);
        });

        wii.on("CWIID_BTN_RIGHT:press", function(key) {
            //node.log("CWIID_BTN_RIGHT press (right)");
            var msg = {'topic': node.topic + '/key'};
            msg.payload = {'key': 'right'};
            node.send(msg);
        });

        wii.on("CWIID_BTN_UP:press", function(key) {
            //node.log("CWIID_BTN_UP press (up)");
            var msg = {'topic': node.topic + '/key'};
            msg.payload = {'key': 'up'};
            node.send(msg);
        });

        wii.on("CWIID_BTN_DOWN:press", function(key) {
            //node.log("CWIID_BTN_DOWN press (down)");
            var msg = {'topic': node.topic + '/key'};
            msg.payload = {'key': 'down'};
            node.send(msg);
        });

        wii.on("CWIID_BTN_A:press", function(key) {
            //node.log("CWIID_BTN_A press");
            var msg = {'topic': node.topic + '/key'};
            msg.payload = {'key': 'A'};
            node.send(msg);
        });

        wii.on("CWIID_BTN_B:press", function(key) {
            //node.log("CWIID_BTN_B press");
            var msg = {'topic': node.topic + '/key'};
            msg.payload = {'key': 'B'};
            node.send(msg);
        });

        wii.on("CWIID_NUNCHUK_BTN_Z:press", function(key) {
            //node.log("CWIID_NUNCHUK_BTN_Z press");
            var msg = {'topic': node.topic + '/key'};
            msg.payload = {'key': 'Z'};
            node.send(msg);
        });

        wii.on("CWIID_NUNCHUK_BTN_C:press", function(key) {
            //node.log("CWIID_NUNCHUK_BTN_C press");
            var msg = {'topic': node.topic + '/key'};
            msg.payload = {'key': 'C'};
            node.send(msg);
        });

        wii.on("move", function(position) {
            //node.log("move", position);
            var msg = {'topic': node.topic + '/key'};
            msg.payload = {'move': position};
            node.send(msg);
        });

        this.on("close", function() {
            wii.device.pause();
            wii.device.close();
        });
    }
    RED.nodes.registerType("wii", WiiNode);
}