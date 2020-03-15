import { NodeI } from "./types";
import style from './tooltip.css';
import { h, FunctionalComponent } from "preact";
import { isOnline } from "./nodes";
import { lastSeen, TimedProps, TimeInfo } from "../time";
import { Device } from "../../types";

interface TooltipProps extends TimedProps {
    info: NodeI;
}

const getTooltip = (device: Device, timeInfo: TimeInfo): string[] => {
    const strings: string[] = [];
    if (device.ManufName) {
        if (device.ModelId) {
            strings.push(`${device.ManufName} ${device.ModelId}`);
        } else {
            strings.push(device.ManufName);
        }
    }
    if (device.ieeeAddr) {
        strings.push(`0x${device.ieeeAddr}`);
    }
    if (device?.st?.linkquality) {
        strings.push(`LinkQuality: ${device.st.linkquality}`)
    }
    if (strings.length == 0) {
        strings.push("A very strange device...");
    }
    if (device.type !== "Coordinator") {
        if (device.last_seen && timeInfo) {
            strings.push(`Last seen: ${lastSeen(device, timeInfo)}`);
        }
        if (!isOnline(device, timeInfo)) {
            strings.push("Offline");
        }
    }
    return strings;
};

const Tooltip: FunctionalComponent<TooltipProps> = (props: TooltipProps) => {
    const { info, time } = props;
    const { device } = info;
    return (
        <div className={style.tooltip}>
            {getTooltip(device, time).map((s) => <div>{s}</div>)}
        </div>

    );
};
export default Tooltip;