const exposes = require('../lib/exposes');
const fz = {...require('../converters/fromZigbee'), legacy: require('../lib/legacy').fromZigbee};
const reporting = require('../lib/reporting');
const e = exposes.presets;

const fzLocal = {
    command_recall_konke: {
        cluster: 'genScenes',
        type: 'commandRecall',
        convert: (model, msg, publish, options, meta) => {
            const payload = {
                241: 'hexagon',
                242: 'square',
                243: 'triangle',
                244: 'circle',
            };
            return {action: payload[msg.data.sceneid]};
        },
    },
};

module.exports = [
    {
        zigbeeModel: ['3AFE170100510001', '3AFE280100510001'],
        model: '2AJZ4KPKEY',
        vendor: 'Konke',
        description: 'Multi-function button',
        fromZigbee: [fz.konke_action, fz.battery, fz.legacy.konke_click],
        toZigbee: [],
        exposes: [e.battery_low(), e.battery(), e.action(['single', 'double', 'hold'])],
        meta: {battery: {voltageToPercentage: '3V_2500'}},
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['genPowerCfg']);
            await reporting.batteryVoltage(endpoint);
            // Has Unknown power source, force it.
            device.powerSource = 'Battery';
            device.save();
        },
    },
    {
        zigbeeModel: ['3AFE14010402000D', '3AFE27010402000D', '3AFE28010402000D'],
        model: '2AJZ4KPBS',
        vendor: 'Konke',
        description: 'Motion sensor',
        fromZigbee: [fz.ias_occupancy_alarm_1_with_timeout, fz.battery],
        toZigbee: [],
        meta: {battery: {voltageToPercentage: '3V_2500'}},
        exposes: [e.occupancy(), e.battery_low(), e.tamper(), e.battery()],
    },
    {
        zigbeeModel: ['3AFE140103020000', '3AFE220103020000'],
        model: '2AJZ4KPFT',
        vendor: 'Konke',
        description: 'Temperature and humidity sensor',
        fromZigbee: [fz.temperature, fz.humidity, fz.battery],
        toZigbee: [],
        meta: {battery: {voltageToPercentage: '3V_2500'}},
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['genPowerCfg', 'msTemperatureMeasurement']);
            await reporting.batteryVoltage(endpoint);
            await reporting.temperature(endpoint);
        },
        exposes: [e.temperature(), e.humidity(), e.battery()],
    },
    {
        zigbeeModel: ['3AFE010104020028'],
        model: 'TW-S1',
        description: 'Photoelectric smoke detector',
        vendor: 'Konke',
        fromZigbee: [fz.ias_smoke_alarm_1],
        toZigbee: [],
        exposes: [e.smoke(), e.battery_low()],
    },
    {
        zigbeeModel: ['3AFE130104020015', '3AFE270104020015', '3AFE280104020015'],
        model: '2AJZ4KPDR',
        vendor: 'Konke',
        description: 'Contact sensor',
        fromZigbee: [fz.ias_contact_alarm_1, fz.battery],
        toZigbee: [],
        meta: {battery: {voltageToPercentage: '3V_2500'}},
        exposes: [e.contact(), e.battery_low(), e.tamper(), e.battery()],
    },
    {
        zigbeeModel: ['LH07321'],
        model: 'LH07321',
        vendor: 'Konke',
        description: 'Water detector',
        fromZigbee: [fz.ias_water_leak_alarm_1],
        toZigbee: [],
        exposes: [e.water_leak(), e.battery_low(), e.tamper()],
    },
    {
        fingerprint: [{modelID: 'TS0222', manufacturerName: '_TYZB01_fi5yftwv'}, {modelID: '3AFE090103021000'}],
        model: 'KK-ES-J01W',
        vendor: 'Konke',
        description: 'Temperature, relative humidity and illuminance sensor',
        fromZigbee: [fz.battery, fz.illuminance, fz.humidity, fz.temperature],
        toZigbee: [],
        exposes: [e.battery(), e.battery_voltage(), e.illuminance(), e.illuminance_lux().withUnit('lx'), e.humidity(), e.temperature()],
    },
    {
        zigbeeModel: ['3AFE241000040002'],
        model: 'KK-TQ-J01W',
        vendor: 'Konke',
        description: 'Smart 4 key scene switch',
        fromZigbee: [fzLocal.command_recall_konke, fz.battery],
        toZigbee: [],
        meta: {battery: {voltageToPercentage: '3V_2500'}},
        exposes: [e.battery(), e.battery_voltage(), e.battery_low(), e.action(['hexagon', 'square', 'triangle', 'circle'])],
    },
    {
        zigbeeModel: ['3AFE07010402100D', '3AFE08010402100D'],
        model: 'KK-BS-J01W',
        vendor: 'Konke',
        description: 'Occupancy sensor',
        fromZigbee: [fz.ias_occupancy_alarm_1_with_timeout, fz.battery],
        toZigbee: [],
        exposes: [e.occupancy(), e.battery_voltage(), e.battery_low(), e.tamper(), e.battery()],
    },
    {
        zigbeeModel: ['3AFE21100402102A'],
        model: 'KK-WA-J01W',
        vendor: 'Konke',
        description: 'Water detector',
        fromZigbee: [fz.ias_water_leak_alarm_1, fz.battery],
        toZigbee: [],
        exposes: [e.water_leak(), e.battery_low(), e.tamper(), e.battery(), e.battery_voltage()],
    },
    {
        zigbeeModel: ['3AFE221004021015'],
        model: 'KK-DS-J01W',
        vendor: 'Konke',
        description: 'Contact sensor',
        fromZigbee: [fz.ias_contact_alarm_1, fz.battery],
        toZigbee: [],
        exposes: [e.contact(), e.battery_low(), e.tamper(), e.battery(), e.battery_voltage()],
    },
];
