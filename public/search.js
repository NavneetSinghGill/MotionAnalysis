const buttonSearch = document.querySelector('#buttonSearch')
const inputTopic = document.querySelector('#inputTopic')
const searchDisplayText = document.querySelector('#searchDisplayText')

console.log('loaded search.js')
buttonSearch.addEventListener('click',(e) => {

    console.log('Searched: ' + inputTopic.value)
    fetch('/store?tag=' + inputTopic.value).then((response) => {
        response.text().then((data) => {
            console.log(data)

            fetch('/search').then((response) => {
                response.json().then((data) => {
                    let count = 0;
                    data = data.map((traversalObject) => {
                        count++;
                        return count + '. ' + traversalObject.summary + '\n';
                    })
                    searchDisplayText.textContent = data
                })
            })

        })
    })

})