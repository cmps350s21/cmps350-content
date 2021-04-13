import express from 'express';
import courseController from './CourseController.js';
let router = express.Router();

router.get('/api/programs', courseController.getPrograms );
router.get('/api/courses/:program', courseController.getCourses );

router.get('/', (req, res) => res.render('index') );
router.get('/courses', courseController.index );

export default router;