
function SearchHeader(props) {
    return (
        <div id="searchHeader" style={{padding: '20px', margin: '20px'}}>
            <input id='inputTopic'></input>
            <button id="buttonSearch" onClick={buttonTapped}>Search</button>
        </div>
    );
}

function SearchResults(props) {
    const list = props.elements.map(element => 
        <li>{element}</li>
    )
    return (
        <ul>{list}</ul>
    );
}

const buttonTapped = () => {
    console.log('Searched: ' + inputTopic.value)
    clearData(() => {
        storeData()
    })
}

const storeData = () => {
    var date = new Date();
    recursiveStoreDate(date, 7);
}

const recursiveStoreDate = (date, iterations) => {
    fetch('/store?tag=' + inputTopic.value + '&before=' + (Math.floor(date/1000)) + '&after=' + (Math.floor((date.getDate() - 1)/1000)), {cache: "no-store"}).then((response) => {
        response.text().then((data) => {
            console.log('', data)

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
                return traversalObject.summary;
            })
            count = 0;
            
            ReactDOM.render(
            <SearchResults elements={data} />,
            document.querySelector('#searchResults')
            );
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

const domContainer = document.querySelector('#searchHeader');
ReactDOM.render(<SearchHeader />, domContainer);