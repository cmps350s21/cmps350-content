import express from 'express';
import courseController from './controllers/CourseController.js';
let router = express.Router();

router.get('/api/programs', (req, res) => courseController.getPrograms(req, res) );
router.get('/api/courses/:program', (req, res) => courseController.getCourses(req, res) );

router.get('/', (req, res) => res.render('index') );
router.get('/courses', (req, res) => courseController.index(req, res) );

export default router;