import express from 'express';

const routes = express.Router();

import GradesController from './controllers/GradesController.js';

routes.get('/home', (_, res) => res.send("<h1>Desafio 02 Bootcamp IGTI</h1>"));

routes.get('/', GradesController.index);
routes.post('/', GradesController.store);
routes.put('/:id', GradesController.update);
routes.delete('/:id', GradesController.destroy);

routes.get('/students/:id', GradesController.findById);
routes.get('/sum', GradesController.calculateStudentGrade);
routes.get('/average', GradesController.calculateAverage);
routes.get('/best', GradesController.findBestGrades);

export default routes;