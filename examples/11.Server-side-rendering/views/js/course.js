const coursesTemplate = `
    <ul>
        {{#each courses}}
            <li>{{code}} - {{name}}</li>
        {{/each}}
    </ul>`

//When the document is loaded in the browser then listen to programsDD on change event
$(document).ready( () => {
    $("#programsDD").on('change', onProgramChange)
})

async function getCouses(programCode) {
    const url = `/api/courses/${programCode}`
    const response = await fetch(url)
    return await response.json()
}

async function onProgramChange() {
    const programCode = $(this).val()
    if (programCode == "") {
        $('#courses-list').empty()
        return
    }

    console.log("onProgramChange.programCode:", programCode)

    try {
        const courses = await getCouses(programCode)

        const htmlTemplate = Handlebars.compile(coursesTemplate)
        const htmlContent = htmlTemplate( { courses } )

        $('#courses-list').html(htmlContent)
    }
    catch (err) {
        console.log(err)
    }
}
