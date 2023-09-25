import definePlugin from "@utils/types";
import HeartbeatHandler, { IHeartbeatHandler } from "./HeartbeatHandler";
import ErrorBoundary from "@components/ErrorBoundary";

let latencyLabelRef: IHeartbeatHandler | null = null;

export default definePlugin({
    name: "Latency",
    description: "Displays the gateway latency based on heartbeats.",
    authors: [
        {
            id: 401490060156862466n,
            name: "shalanor"
        }
    ],
    patches: [
        {
            // Module 652555
            find: "this._startHeartbeater()",
            replacement: [{
                match: /((?:\w+)\.heartbeatAck=!1;(?:\w+)\._sendHeartbeat\(\))/,
                replace: "$1;$self.onHeartbeatSent();"
            }, {
                match: /(this\.lastHeartbeatAckTime=Date\.now\(\);)/,
                replace: "$1;$self.onHeartbeatAck();"
            }]
        },
        {
            find: '("guildsnav")',
            replacement: [{
                match: /(\i)\(\){return (\i\(\(0,\i\.jsx\)\("div",{className:\i\(\)\.guildSeparator}\)\))}/,
                replace: "$1(){return $self.LatencyLabel({ renderSeparator: function() {return $2;} });}"
            }]
        }
    ],

    onHeartbeatSent() {
        latencyLabelRef?.onHeartbeatSent();
    },

    onHeartbeatAck() {
        latencyLabelRef?.onHeartbeatAck();
    },

    LatencyLabel: ErrorBoundary.wrap(
        HeartbeatHandler,
        { noop: true },
        {
            parentRef: (node: IHeartbeatHandler) => latencyLabelRef = node
        }
    ),
});