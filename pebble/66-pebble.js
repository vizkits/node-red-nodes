module.exports = function(RED) {
    "use strict";
    var Cylon = require('cylon');
	
    function PebbleNode(n) {
        RED.nodes.createNode(this, n);
        this.topic = n.topic;
        this.host = n.host;
        this.port = n.port;
        var node = this;

        Cylon.api({
            host: node.host,
            port: node.port,
            ssl: false
        });

        Cylon.robot({
            name: 'pebble',

            connections: {
                pebble: { adaptor: 'pebble' }
            },

            devices: {
                pebble: { driver: 'pebble' }
            },

            work: function(my) {

                my.pebble.send_notification("Hello!");

                my.pebble.on('button', function(data) {
                    var msg = {'topic': node.topic + '/key'};
                    msg.payload = {'key': data};
                    node.send(msg);
                });

                my.pebble.on('tap', function() {
                    node.log("Tap event detected");
                    var msg = {'topic': node.topic + '/tap'};
                    msg.payload = {'value': 'yes'};
                    node.send(msg);
                });

                my.pebble.on('accel', function(data) {
                    // acc data [-4000, 4000] mg as "-256,-160,-920"
                    var a = data.split(',');
                    var msg = {'topic': node.topic + '/accelerometer'};
                    msg.payload = {'x': +a[0]/1000, 'y': +a[1]/1000, 'z': +a[2]/1000};
                    node.send(msg);
                });
            }
        }).start();


        this.on("close", function() {
            Cylon.halt();
        });
    }
    RED.nodes.registerType("pebble", PebbleNode);
}