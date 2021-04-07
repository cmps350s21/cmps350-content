export function busRepository() {
    let requests = [];
    if (localStorage.getItem('bus'))
        requests = JSON.parse(localStorage.getItem('bus'));
    return requests;
}
export function setRequests(requests) {
    localStorage.setItem('bus', JSON.stringify(requests));
}