const buttonSearch = document.querySelector('#buttonSearch')
const inputTopic = document.querySelector('#inputTopic')

console.log('loaded search.js')
buttonSearch.addEventListener('click',(e) => {
    console.log('Search initiated')
    fetch('/search?tag=' + inputTopic.value)
})