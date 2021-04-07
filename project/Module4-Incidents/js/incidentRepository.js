const db = new Localbase('incidents.db')

export async function getIncidents() {
    return await db.collection('incident').get()
}

export async function getIncident(incidentId) {
    return await db.collection('incident').doc({id: incidentId}).get()
}

export async function updateIncident(incidentId, updateWith) {
    return await db.collection('incident').doc({id: incidentId}).update(updateWith)
}

export async function overWriteIncident(incidentId, owWith) {
    return await db.collection('incident').doc({id: incidentId}).set(owWith)
}

export async function deleteIncident(incidentId) {
    await db.collection('incident').doc({id: incidentId}).delete()
}

export async function addIncident(formObject) {
    await db.collection('incident').add(formObject)
}

export async function getLocations(){
    const locations= await db.collection('location').get()
    let locationsHTML=locations.map(loc=>`<option value="${loc.index}" id="${loc.name}">${loc.name}</option>`)
    return `
    ${locationsHTML.join('')}
    `
}

export async function getTypes(){
    const types= await db.collection('type').get()
    let typesHTML=types.map(t=>`<option value="${t.index}" id="${t.name}">${t.name}</option>`)
    return `
    ${typesHTML.join('')}
    `
}

export function form2Object(formElement) {
    const formData = new FormData(formElement)
    const data = {}
    for (const [key, value] of formData) {
        data[key] = value
    }
    return data
}


