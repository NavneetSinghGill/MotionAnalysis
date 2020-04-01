
function SearchHeader(props) {
    return (
        <div id="searchHeader" style={{padding: '20px', margin: '20px'}}>
            <input id='inputTopic'></input>
            <button id="buttonSearch" style={{
                'margin-left': '20px'
            }} onClick={buttonTapped}>Search</button>
        </div>
    );
}

function TrendsDiv(props) {
    return (
        <div>
            <TrendsButton name='Coronavirus'/>
            <TrendsButton name='Camila Cabello'/>
            <TrendsButton name='Stock'/>
        </div>
    );
}

function TrendsButton(props) {
    return (
        <button style={{
            'background-color': '#00cc00',
            'border-radius': '5px',
            // 'width': '50px',
            'height': '30px',
            'margin': '20px',
            'margin-left': '40px'}} onClick={() => trendButtonTapped(props.name)}>
                {props.name}
                </button>
    );
}

function trendButtonTapped(value) {
    inputTopic.value = value;
    buttonTapped();
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
        if(element.imageUrl != undefined) {
            return (
            <li style={{'flex-direction': 'column'}}>
                <object type='text/html' data={element.imageUrl}/>
                {element.summary}
            </li>);
        } else {
            return (
            <li style={{'flex-direction': 'column'}}>
                {element.summary}
            </li>);
        }
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
    document.querySelector('#buttonSearch').value = 'Loading...';
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

            document.querySelector('#buttonSearch').value = 'Search Again';
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

setTimeout(() => {
    const trendsDiv = document.querySelector('#trendsDiv');
    ReactDOM.render(<TrendsDiv />, trendsDiv);
}, 2000);
