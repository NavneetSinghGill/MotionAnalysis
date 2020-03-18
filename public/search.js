const buttonSearch = document.querySelector('#buttonSearch')
const inputTopic = document.querySelector('#inputTopic')

console.log('loaded search.js')
buttonSearch.addEventListener('click',(e) => {
    console.log('Searched: ' + inputTopic.value)
    fetch('/search?tag=' + inputTopic.value).then((response) => {
        response.text().then((data) => {
            console.log(data)
        })
    })
})