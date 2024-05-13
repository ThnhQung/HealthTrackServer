import mongoose, { Schema, ObjectId } from "mongoose"
const Exercise = mongoose.model("Exercise", new Schema({
    id: { type: ObjectId },
    title: {
        type: String,
    },
    time: {
        type: Number,
    },
    calo: {
        type: Number,
    },
    smallExercises: [{
        idSmall: {
            type: ObjectId,
        },
        titleSmall: {
            type: String,
        },
        timeSmall: {
            type: String,
        },
        exercisePicture: {
            type: String,
        },
        listContent: [{
            type: String,
        }]
    }]
}))

export default Exercise