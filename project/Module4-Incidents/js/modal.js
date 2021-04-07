const closeBtn = document.querySelector('.closeBtn')
const addBtn = document.querySelector('#addBtn')
const addModal = document.querySelector('.addPop')

addBtn.addEventListener('click', newItem)
closeBtn.addEventListener('click', closeModal)

function newItem() {
    addModal.style.display = 'block'
}

function closeModal() {
    addModal.style.display = 'none'
}


