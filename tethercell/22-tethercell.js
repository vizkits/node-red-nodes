module.exports = function(RED) {
    "use strict";
    var tethercell = require('tethercell');
	
    function TethercellNode(n) {
        RED.nodes.createNode(this, n);
        this.uuid = n.uuid;
        var node = this;

        tethercell.discoverById(this.uuid, function(cell) {
            node.log('discoverd ' + cell.uuid);
            node.topic = node.topic || cell.uuid;
            node.sensor = cell;

            cell.on('disconnect', function() {
                node.log('disconnected ' + cell.uuid);
            });

            function listenForLight() {
                node.log('listen for message...');
                node.on('input', function(msg) {
                    var topic = msg.topic;
                    if (topic.indexOf('/light') !== -1) {
                        var light = JSON.parse(msg.payload).value;
                        if (light === "on") {
                            cell.turnOn(function() {
                                node.log('Light on');
                            });
                        } else {
                            cell.turnOff(function() {
                                node.log('Light off');
                            });
                        }
                    }
                });
            }

            cell.connectAndSetup(function() {
                node.log('connect + setup');
                var pin = '00000000';   
                cell.authorize(pin, listenForLight);
            });
        });

        this.on("close", function() {
            if (node.sensor) {
                node.sensor.disconnect();
            }
        });
    }
    RED.nodes.registerType("tethercell", TethercellNode);
}