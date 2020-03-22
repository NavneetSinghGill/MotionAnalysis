
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
    var list = props.elements.map(function (element) {
        return React.createElement(
            'li',
            null,
            element
        );
    });
    return React.createElement(
        'ul',
        null,
        list
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
            data = data.map(function (traversalObject) {
                count++;
                return traversalObject.summary;
            });
            count = 0;

            ReactDOM.render(React.createElement(SearchResults, { elements: data }), document.querySelector('#searchResults'));
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