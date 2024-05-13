import express from 'express';
import { body, validationResult } from 'express-validator';
import {
    exerciseController
} from '../controllers/index.js'

const router = express.Router();


router.get('/', exerciseController.getAllExercise);
router.post('/create', exerciseController.createExercise );
export default router;