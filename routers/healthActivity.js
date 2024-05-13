import express from 'express';
import { 
    healthActivityController 
} from '../controllers/index.js'
const router = express.Router();

router.post('/', healthActivityController.insertHealthActivity)
router.get('/:idUser/:date', healthActivityController.getDataHealth)
router.patch('/update/:idUser/:date', healthActivityController.updateHealthActivityController);
export default router;
