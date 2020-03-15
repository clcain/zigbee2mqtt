import { GATEWAY } from './consts';
import { GraphI, NodeI, LinkType } from './types';
import { Device, Dictionary, DeviceType } from '../../types';
import { genDeviceShortAddress } from '../../utils';

const getName = (device: Device, deviceKey: string): string => {
	const { friendly_name: friendlyName } = device;
	return friendlyName ?? `${genDeviceShortAddress(deviceKey) ?? 'Unknow device'}`;
};
export const convert2graph = (file: Dictionary<Device>): GraphI => {
	const coordinator: NodeI = {
		id: 'SLS GW',
		device: GATEWAY,
		name: 'GW'
	};

	const graph: GraphI = {
		nodes: [coordinator],
		links: []
	};
	const getLinkType = (source: DeviceType, dest: DeviceType): LinkType => `${source}2${dest}` as LinkType;

	Object.entries(file).forEach(([deviceKey, deviceData]) => {
		graph.nodes.push({
			id: deviceKey,
			name: getName(deviceData, deviceKey),
			device: deviceData
		});
		if (Array.isArray(deviceData.Rtg) && deviceData.Rtg.length) {
			deviceData.Rtg.forEach(route => {
				graph.links.push({
					source: deviceKey,
					target: route.toString(),
					linkQuality: deviceData?.st?.linkquality,
					type: getLinkType(deviceData.type, file[route.toString()].type)
				});
			});
		}
		else {
			graph.links.push({
				source: deviceKey,
				target: coordinator.id,
				linkQuality: deviceData?.st?.linkquality,
				type: getLinkType(deviceData.type, "Coordinator")
			});
		}
	});
	return graph;
};