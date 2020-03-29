
function SearchHeader(props) {
    return (
        <div id="searchHeader" style={{padding: '20px', margin: '20px'}}>
            <input id='inputTopic'></input>
            <button id="buttonSearch" onClick={buttonTapped}>Search</button>
        </div>
    );
}

function SearchResults(props) {

    const list = props.elements.map(groupElement => 
        <SearchResultsDiv elements={groupElement}/>
    )
    return (
        <div>
            {list}
        </div>
    );
}

function SearchResultsDiv(props) {

    const allLi = props.elements.map(element => {
        return (<li>{element.summary}</li>);
    });
    const date = new Date(props.elements[0].timestamp * 1000000);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dateString = dayName[date.getDay()] + ', ' + date.getDate() + ' ' + monthNames[date.getMonth()] + ' \'' + date.getFullYear();
    return (
        <div>
            <h4 style={{margin: '20px'}}>
                {dateString}
            </h4>
            <ul>{allLi}</ul>
        </div>
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
            // data = data.map((traversalObject) => {
            //     count++;
            //     return traversalObject.summary;
            // })
            let dayWiseData = [];
            let currentDayData;
            let currentDayTimeStamp = 0;

            for(let i = 0; i<data.length; i++) {
                console.log(i)
                if(data[i].timestamp != currentDayTimeStamp) {
                    currentDayTimeStamp = data[i].timestamp;
                    // count = i;
                    currentDayData = [];
                    dayWiseData.push(currentDayData);
                }
                currentDayData.push(data[i]);
                // dayWiseData[dayCount][i - count] = data[i];
            }
            count = 0;

            ReactDOM.render(
            <SearchResults elements={dayWiseData} />,
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