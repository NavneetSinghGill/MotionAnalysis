
function SearchHeader(props) {
    return React.createElement(
        'div',
        { id: 'searchHeader', style: { padding: '20px', margin: '20px' } },
        React.createElement('input', { id: 'inputTopic' }),
        React.createElement(
            'button',
            { id: 'buttonSearch', onClick: buttonTapped },
            'Search'
        )
    );
}

function SearchResults(props) {

    var list = props.elements.map(function (groupElement) {
        return React.createElement(SearchResultsDiv, { elements: groupElement });
    });
    return React.createElement(
        'div',
        null,
        list
    );
}

function SearchResultsDiv(props) {

    var allLi = props.elements.map(function (element) {
        if (element.imageUrl != undefined) {
            return React.createElement(
                'li',
                { style: { 'flex-direction': 'column' } },
                React.createElement('object', { type: 'text/html', data: element.imageUrl }),
                element.summary
            );
        } else {
            return React.createElement(
                'li',
                { style: { 'flex-direction': 'column' } },
                element.summary
            );
        }
    });
    var date = new Date(props.elements[0].timestamp * 1000000);
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var dateString = dayName[date.getDay()] + ', ' + date.getDate() + ' ' + monthNames[date.getMonth()] + ' \'' + date.getFullYear();

    return React.createElement(
        'div',
        null,
        React.createElement(
            'h4',
            { style: { margin: '20px' } },
            dateString
        ),
        React.createElement(
            'ul',
            null,
            allLi
        )
    );
}

var buttonTapped = function buttonTapped() {
    console.log('Searched: ' + inputTopic.value);
    clearData(function () {
        storeData();
    });
};

var storeData = function storeData() {
    var date = new Date();
    recursiveStoreDate(date, 7);
};

var recursiveStoreDate = function recursiveStoreDate(date, iterations) {
    fetch('/store?tag=' + inputTopic.value + '&before=' + Math.floor(date / 1000) + '&after=' + Math.floor((date.getDate() - 1) / 1000), { cache: "no-store" }).then(function (response) {
        response.text().then(function (data) {
            console.log('', data);

            if (iterations == 1) {
                searchFromPrivateData();
            } else {
                date.setDate(date.getDate() - 1);
                recursiveStoreDate(date, --iterations);
            }
        });
    });
};

var searchFromPrivateData = function searchFromPrivateData() {
    fetch('/searchFromPrivateData').then(function (response) {
        response.json().then(function (data) {
            var count = 0;
            // data = data.map((traversalObject) => {
            //     count++;
            //     return traversalObject.summary;
            // })
            var dayWiseData = [];
            var currentDayData = void 0;
            var currentDayTimeStamp = 0;

            for (var i = 0; i < data.length; i++) {
                console.log(i);
                if (data[i].timestamp != currentDayTimeStamp) {
                    currentDayTimeStamp = data[i].timestamp;
                    // count = i;
                    currentDayData = [];
                    dayWiseData.push(currentDayData);
                }
                currentDayData.push(data[i]);
                // dayWiseData[dayCount][i - count] = data[i];
            }
            count = 0;

            ReactDOM.render(React.createElement(SearchResults, { elements: dayWiseData }), document.querySelector('#searchResults'));
        });
    });
};

var clearData = function clearData(callback) {
    fetch('/clearData').then(function (response) {
        response.text().finally(function (value) {
            callback();
        });
    });
};

var domContainer = document.querySelector('#searchHeader');
ReactDOM.render(React.createElement(SearchHeader, null), domContainer);