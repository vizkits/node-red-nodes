module.exports = function(RED) {
    "use strict";
    var robot = require("robotjs");
	
    function AutokeyNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        function move(x, y) {
            var mouse = robot.getMousePos();
            robot.moveMouseSmooth(mouse.x + x, mouse.y + y);
        }

        this.on('input', function(msg) {
            var topic = msg.topic;
            if (topic.indexOf('/key') !== -1) {
                var payload = msg.payload;
                if (typeof payload === 'string') {
                    payload = JSON.parse(msg.payload);
                }
                if (payload.key) {
                    robot.keyTap(payload.key);
                }
                if (payload.move) {
                    move(payload.move.x, payload.move.y);
                }
            }
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("autokey", AutokeyNode);
}