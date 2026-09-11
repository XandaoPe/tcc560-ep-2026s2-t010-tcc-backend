import { Request, Response } from 'express';
import { ThermalEventModel } from '../models/ThermalEvent';
import { processScenarioRule, ScenarioInput } from '../services/ruleEngine';

export const handleSimulationTrigger = async (req: Request, res: Response): Promise<void> => {
    try {
        const input: ScenarioInput = req.body;

        // Processa a regra do cenário acionado pelo botão simulador
        const evaluatedEventData = processScenarioRule(input);

        // Salva no MongoDB Atlas
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

export const getEventsHistory = async (_req: Request, res: Response): Promise<void> => {
    try {
        const events = await ThermalEventModel.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json(events);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erro ao buscar histórico.' });
    }
};