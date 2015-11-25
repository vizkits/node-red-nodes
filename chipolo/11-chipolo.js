module.exports = function(RED) {
    "use strict";
	var Chipolo = require('chipolo');
	
    function ChipoloNode(n) {
        RED.nodes.createNode(this, n);
        this.topic = n.topic;
        this.uuid = n.uuid;
        var node = this;

        Chipolo.discover(function(chipolo) {
            node.log('discovered ' + chipolo.uuid);
            node.topic = node.topic || chipolo.uuid;
            node.sensor = chipolo;

            chipolo.setMaxListeners(0);

            chipolo.on('disconnect', function() {
                node.log('disconnected ' + chipolo.uuid);
            });

            function listen(success) {
                node.log('paired ready');

                //chipolo.setAudioNotifications(true, true, true, function() {
                //    node.log('audio notification set');
                //});

                setInterval(function() {
                    chipolo.estimateDistance(function(dist, rssi) {
                        //node.log('chipolo estimated distance = ' + dist.toFixed(1) + ' ' + rssi);
                        if (dist < 5) {
                            chipolo.beep();
                        }
                        var msg = {'topic': node.topic + '/distance'};
                        msg.payload = {'distance': dist.toFixed(2), 'rssi':rssi};
                        node.send(msg);
                    });
                }, 1000);
            }

            chipolo.connect(function() {
                chipolo.discoverServicesAndCharacteristics(function() {
                    chipolo.pair(listen);
                });
            });
        });

        this.on("close", function() {
            if (node.sensor) {
                node.sensor.disconnect();
            }
        });
    }
    RED.nodes.registerType("chipolo", ChipoloNode);
}