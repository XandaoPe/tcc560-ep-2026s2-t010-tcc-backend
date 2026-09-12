import { Router } from 'express';
import {
    handleSimulationTrigger,
    getEventsHistory,
    deleteThermalEvent,
    deleteThermalEventsBatch
} from '../controllers/thermalController';

const router = Router();

router.post('/simulate', handleSimulationTrigger);
router.get('/events', getEventsHistory);
router.delete('/events/:id', deleteThermalEvent);
router.post('/events/batch-delete', deleteThermalEventsBatch);

export default router;