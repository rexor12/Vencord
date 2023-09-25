import { React, useMemo, useState } from "@webpack/common";
import { useForceUpdater } from "@utils/react";

export interface IHeartbeatHandler {
    onHeartbeatSent: () => void;
    onHeartbeatAck: () => void;
}

export interface IHeartbeatHandlerProps {
    renderSeparator: () => JSX.Element;
    parentRef: React.RefCallback<any>;
}

const HeartbeatHandler = (props: IHeartbeatHandlerProps) => {
    const forceUpdate = useForceUpdater();

    const [lastHeartbeatTime, setLastHeartbeatTime] = useState<number>(Date.now());
    const [latencyMs, setLatencyMs] = useState<number>(0);

    React.useImperativeHandle(props.parentRef, () => {
        return ({
            onHeartbeatSent(): void {
                setLastHeartbeatTime(Date.now());
            },

            onHeartbeatAck(): void {
                setLatencyMs(Date.now() - lastHeartbeatTime);
                forceUpdate();
            }
        } as IHeartbeatHandler);
    }, [lastHeartbeatTime, setLastHeartbeatTime, setLatencyMs, forceUpdate]);

    const fontColor = useMemo(() => {
        return latencyMs > 500
            ? "red"
            : latencyMs > 200
                ? "orange"
                : "green";
    }, [latencyMs]);

    return (
        <>
            {props.renderSeparator()}
            <div style={{ display: "flex", color: fontColor, justifyContent: "center", margin: "4px" }}>
                <span style={{ fontWeight: "bold" }}>{latencyMs} ms</span>
            </div>
            {props.renderSeparator()}
        </>
    );
};

export default HeartbeatHandler;