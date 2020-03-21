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
    var date = new Date();
    // fetch('/store?tag=' + inputTopic.value + '&date=' + (Math.floor(date/1000)), {cache: "no-store"}).then((response) => {
    //     response.text().then((data) => {
    //         console.log('LOOOOOOOOOOOOOOOOOL', data)

    //         searchFromPrivateData();
    //     })
    // })
    recursiveStoreDate(date, 7);
}

const recursiveStoreDate = (date, iterations) => {
    fetch('/store?tag=' + inputTopic.value + '&before=' + (Math.floor(date/1000)) + '&after=' + (Math.floor((date.getDate() - 1)/1000)), {cache: "no-store"}).then((response) => {
        response.text().then((data) => {
            console.log('LOOOOOOOOOOOOOOOOOL', data)

            if(iterations == 1) {
                searchFromPrivateData();
            } else {
                date.setDate(date.getDate() - 1)
                recursiveStoreDate(date, --iterations)
            }
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