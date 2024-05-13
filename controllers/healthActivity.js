import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { HealthActivityRepository } from '../repositories/index.js';


async function insertHealthActivity(req, res) {
    try {
        const healthActivity = await HealthActivityRepository.insertHealthActivity(req.body)
        res.status(HttpStatusCode.INSERT_OK).json({
            message: 'Insert HealthActivity successfully',
            data: healthActivity
        })
    } catch (exception) {
        res.status(HttpStatusCode.INTERNAL_SEVER_ERROR).json({
            message: 'Cannot insert HealthActivity: ' + exception,
            validationErrors: exception.validationErrors
        })
    }
}

async function getDataHealth(req, res) {
    try {
        let idUser = req.params.idUser
        // let id = req.params.id
        let date = req.params.date

        let filteredHealthActivity = await HealthActivityRepository.getDataHealth(idUser, date)

        res.status(HttpStatusCode.OK).json({
            message: 'get health activity by params successfully',
            data: filteredHealthActivity,
        })
    } catch (exception) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: exception.message,
        })
    }
}

async function updateHealthActivityController(req, res) {
    const { idUser, date } = req.params;
    const { newData } = req.body;

    try {
        const updatedHealthActivity = await HealthActivityRepository.updateHealthActivity({ idUser, date, newData });

        res.status(HttpStatusCode.OK).json({
            message: 'Update health activity successfully',
            data: updatedHealthActivity,
        });
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        });
    }
}



export default {
    insertHealthActivity,
    getDataHealth,
    updateHealthActivityController

}