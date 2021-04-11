
class CourseRepository {
    constructor() {
        this.fetch = require('node-fetch')
    }

    async getPrograms() {
        const data = await this.fetch('https://cmps356s17.github.io/data/ceng-programs.json')
        return await data.json()
    }

    async getCourses(program) {
        const data = await this.fetch('https://cmps356s17.github.io/data/ceng-courses.json')
        let courses = await data.json()

        return courses.filter(c => c.program === program.toUpperCase())
    }
}

module.exports = new CourseRepository()
