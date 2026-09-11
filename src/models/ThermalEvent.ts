import { Schema, model, Document } from 'mongoose';

export interface IThermalEvent extends Document {
    eventId: string;
    assetId: string;
    timestampSource: string;
    timestampReceived: string;
    zone: string;
    variable: string;
    value: number;
    unit: string;
    setpointC: number;
    eventCode: string;
    severity: string;
    quality: string;
    provenance: string;
    schemaVersion: string;
}

const ThermalEventSchema = new Schema<IThermalEvent>({
    eventId: { type: String, required: true },
    assetId: { type: String, required: true },
    timestampSource: { type: String, required: true },
    timestampReceived: { type: String, required: true },
    zone: { type: String, required: true },
    variable: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    setpointC: { type: Number, required: true },
    eventCode: { type: String, required: true },
    severity: { type: String, required: true },
    quality: { type: String, required: true },
    provenance: { type: String, required: true },
    schemaVersion: { type: String, required: true },
}, { timestamps: true });

export const ThermalEventModel = model<IThermalEvent>('ThermalEvent', ThermalEventSchema);