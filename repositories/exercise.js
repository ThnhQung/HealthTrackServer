import mongoose from "mongoose"
import Exception from "../exceptions/Exception.js"
import { Exercise } from '../models/index.js'

const createExercise = async ({ title, time, calo, smallExercises }) => {
    try {
        const exercise = await Exercise.create({ title, time, calo, smallExercises })
        return exercise
    } catch (error) {
        debugger
        if (!!error.errors) throw new Exception("Input error", error.errors)
    }

}

const getAllExercise = async () => {
    const exercise = await Exercise.find();
    return exercise
}

export default {
    createExercise,
    getAllExercise
}