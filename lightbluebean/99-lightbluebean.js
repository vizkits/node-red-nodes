module.exports = function(RED) {
    "use strict";
    var beanio = require('bean-io');
	
    function LightBlueBeanNode(n) {
        RED.nodes.createNode(this, n);
        this.uuid = n.uuid;
        this.topic = n.topic;
        this.intervalId = null;
        var node = this;

        var board = new beanio.Board({uuid: node.uuid});

        board.on("ready", function() {
            node.log("bean ready");

            var bean = board.connectedBean;
            node.topic = node.topic || bean.uuid;

            bean.on("accell", function(x, y, z, valid) {
                var msg = {'topic': node.topic + '/accelerometer'};
                msg.payload = {'x': +x, 'y': +y, 'z': +z};
                node.send(msg);
            });

            bean.on("temp", function(temp, valid) {
                var msg = {'topic': node.topic + '/temperature'};
                msg.payload = {'object': temp,'ambient': temp};
                node.send(msg);
            });

            node.intervalId = setInterval(function() {
                bean.requestAccell();
                bean.requestTemp();
            }, 1000);
        });

        this.on("close", function() {
            if (node.intervalId != null) {
                clearInterval(node.intervalId);
            }
            if (board.connectedBean) {
                board.connectedBean.disconnect();
            }
        });
    }
    RED.nodes.registerType("lightbluebean", LightBlueBeanNode);
}