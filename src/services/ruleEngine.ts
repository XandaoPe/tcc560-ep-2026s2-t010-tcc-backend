import { Request, Response } from 'express'; // se necessário manter consistência

export interface ScenarioInput {
    scenarioType: 'S1' | 'S2' | 'S3' | 'S4' | 'S5';
    zone?: string;
    customValue?: number;
}

export const processScenarioRule = (input: ScenarioInput) => {
    const now = new Date().toISOString();
    let baseEvent = {
        eventId: crypto.randomUUID(),
        assetId: 'ROMI-SIM-01',
        timestampSource: now,
        timestampReceived: now,
        zone: input.zone || 'ZONA_2',
        variable: 'temperature',
        unit: 'C',
        setpointC: 220.0,
        quality: 'VALID',
        provenance: 'simulated',
        schemaVersion: '1.0'
    };

    switch (input.scenarioType) {
        case 'S1': // Operação Normal
            return {
                ...baseEvent,
                value: 220.0,
                eventCode: 'NORMAL',
                severity: 'NONE'
            };
        case 'S2': // Excedeu limite de aquecimento
            return {
                ...baseEvent,
                value: 255.5,
                eventCode: 'HEATING_LIMIT_EXCEEDED',
                severity: 'MEDIUM'
            };
        case 'S3': // Desvio negativo de temperatura zona X
            return {
                ...baseEvent,
                value: 185.0,
                eventCode: 'NEGATIVE_TEMP_DEVIATION',
                severity: 'HIGH'
            };
        case 'S4': // Queima total (Band Break)
            return {
                ...baseEvent,
                value: 25.0,
                eventCode: 'BAND_BREAK_TOTAL_FAILURE',
                severity: 'CRITICAL'
            };
        case 'S5': // Bloqueio da produção
            return {
                ...baseEvent,
                value: 0.0,
                eventCode: 'PRODUCTION_LOCKOUT',
                severity: 'CRITICAL'
            };
        default:
            throw new Error('Cenário desconhecido');
    }
};