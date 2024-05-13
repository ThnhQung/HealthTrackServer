import Exception from '../exceptions/Exception.js';
import {ExerciseRepository} from '../repositories/index.js';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';

async function createExercise(req, res) {
    try {
        let exercise = await ExerciseRepository.createExercise(req.body)
        res.status(HttpStatusCode.OK).json({
            message : 'Create exercise successfully',
            data : exercise
        })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message : error.message,
        })
    }
}

async function getAllExercise(req, res) {
    try {
        let exercise = await ExerciseRepository.getAllExercise({})
        res.status(HttpStatusCode.OK).json({
            message : 'Get all exercise successfully',
            data : exercise
        })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message : error.message,
        })
    }
}

export default {
    getAllExercise,
    createExercise
}