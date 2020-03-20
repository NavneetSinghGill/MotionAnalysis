const buttonSearch = document.querySelector('#buttonSearch')
const inputTopic = document.querySelector('#inputTopic')
const searchResultsDiv = document.querySelector('#searchResultsDiv')

console.log('loaded search.js')
buttonSearch.addEventListener('click',(e) => {

    console.log('Searched: ' + inputTopic.value)
    clearData(() => {
        storeData()
    })
})

const storeData = () => {
    fetch('/store?tag=' + inputTopic.value, {cache: "no-store"}).then((response) => {
        response.text().then((data) => {
            console.log(data)

            searchFromPrivateData();
        })
    })
}

const searchFromPrivateData = () => {
    fetch('/searchFromPrivateData').then((response) => {
        response.json().then((data) => {
            let count = 0;
            data = data.map((traversalObject) => {
                count++;
                // return count + '. ' + traversalObject.summary + '\n';
                return traversalObject.summary;
            })
            // searchResultsDiv.textContent = data
            count = 0;
            searchResultsDiv.childNodes.forEach(child => {
                searchResultsDiv.removeChild(child);
            })

            var ul = document.createElement("ul");
            data.forEach(element => {
                addListItem(count, element, ul);
                count++;
            });
            searchResultsDiv.appendChild(ul);
        })
    })
}

const clearData = (callback) => {
    fetch('/clearData').then((response) => {
        response.text().finally((value) => {
            callback()
        })
    })
}

function addListItem(index, text, ul) {
    var li = document.createElement("li");
    li.setAttribute('id','searchResultsDiv_id' + index);
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li);
}