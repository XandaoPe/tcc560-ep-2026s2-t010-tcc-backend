import { Request, Response } from 'express';
import { ThermalEventModel } from '../models/ThermalEvent';
import { processScenarioRule, ScenarioInput } from '../services/ruleEngine';

export const handleSimulationTrigger = async (req: Request, res: Response): Promise<void> => {
    try {
        const input: ScenarioInput = req.body;

        const evaluatedEventData = processScenarioRule(input);

        const newEvent = new ThermalEventModel(evaluatedEventData);
        await newEvent.save();

        res.status(201).json({
            message: 'Evento processado e persistido com sucesso.',
            data: newEvent
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erro interno ao processar simulação.' });
    }
};

export const getEventsHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { zone, severity, eventCode, search, timeRange } = req.query;
        let query: any = {};

        const now = new Date();
        if (timeRange === '1h' || (!zone && !severity && !eventCode && !search && !timeRange)) {
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            query.createdAt = { $gte: oneHourAgo };
        } else if (timeRange === '24h') {
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            query.createdAt = { $gte: twentyFourHoursAgo };
        } else if (timeRange === '7d') {
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            query.createdAt = { $gte: sevenDaysAgo };
        }

        if (zone) {
            query.zone = zone;
        }
        if (severity) {
            query.severity = severity;
        }
        if (eventCode) {
            query.eventCode = eventCode;
        }
        if (search) {
            query.$or = [
                { assetId: { $regex: search, $options: 'i' } },
                { eventCode: { $regex: search, $options: 'i' } },
                { zone: { $regex: search, $options: 'i' } },
                { severity: { $regex: search, $options: 'i' } },
                { provenance: { $regex: search, $options: 'i' } }
            ];
        }

        const events = await ThermalEventModel.find(query).sort({ createdAt: -1 }).limit(100);
        res.status(200).json(events);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erro ao buscar histórico.' });
    }
};

export const deleteThermalEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await ThermalEventModel.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ error: 'Evento não encontrado.' });
            return;
        }
        res.status(200).json({ message: 'Evento excluído com sucesso.' });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erro ao excluir evento.' });
    }
};

export const deleteThermalEventsBatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ error: 'Nenhum ID fornecido para exclusão.' });
            return;
        }
        await ThermalEventModel.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Eventos excluídos com sucesso.' });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erro ao excluir eventos em lote.' });
    }
};