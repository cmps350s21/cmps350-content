class CourseController {
    constructor() {
        this.courseRepository = require('./../models/CourseRepository')
    }

    async getPrograms(req, res) {
        let programs = await this.courseRepository.getPrograms()
        res.json(programs)
    }

    async getCourses(req, res) {
        try {
            let program = req.params.program
            console.log('getCourses.req.params.program', program)

            let courses = await this.courseRepository.getCourses( program )
            //console.log(JSON.stringify(courses, null, 2))
            res.json(courses)
        }
        catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }

    async index (req, res) {
        let programs = await this.courseRepository.getPrograms()
        res.render('course', { programs })
    }
}

module.exports = new CourseController()