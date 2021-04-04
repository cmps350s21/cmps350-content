let express = require('express');
let courseController = require('./controllers/CourseController')
let router = express.Router();

router.get('/api/programs', (req, res) => courseController.getPrograms(req, res) )
router.get('/api/courses/:program', (req, res) => courseController.getCourses(req, res) )

router.get('/', (req, res) => res.render('index') )
router.get('/courses', (req, res) => courseController.index(req, res) )

module.exports = router;