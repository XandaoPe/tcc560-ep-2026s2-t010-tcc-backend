import { Router } from 'express';
import { handleSimulationTrigger, getEventsHistory } from '../controllers/thermalController';

const router = Router();

router.post('/simulate', handleSimulationTrigger);
router.get('/events', getEventsHistory);

export default router;