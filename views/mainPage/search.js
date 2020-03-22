var buttonSearch = document.querySelector('#buttonSearch');
var inputTopic = document.querySelector('#inputTopic');
var searchResultsDiv = document.querySelector('#searchResultsDiv');

console.log('loaded search.js');
buttonSearch.addEventListener('click', function (e) {

    console.log('Searched: ' + inputTopic.value);
    clearData(function () {
        storeData();
    });
});
var buttonTapped = function buttonTapped(e) {
    console.log('search.js Searched: ' + e.value);
    clearData(function () {
        storeData();
    });
};

var storeData = function storeData() {
    var date = new Date();
    // fetch('/store?tag=' + inputTopic.value + '&date=' + (Math.floor(date/1000)), {cache: "no-store"}).then((response) => {
    //     response.text().then((data) => {
    //         console.log('LOOOOOOOOOOOOOOOOOL', data)

    //         searchFromPrivateData();
    //     })
    // })
    recursiveStoreDate(date, 7);
};

var recursiveStoreDate = function recursiveStoreDate(date, iterations) {
    fetch('/store?tag=' + inputTopic.value + '&before=' + Math.floor(date / 1000) + '&after=' + Math.floor((date.getDate() - 1) / 1000), { cache: "no-store" }).then(function (response) {
        response.text().then(function (data) {
            console.log('LOOOOOOOOOOOOOOOOOL', data);

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
                // return count + '. ' + traversalObject.summary + '\n';
                return traversalObject.summary;
            });
            // searchResultsDiv.textContent = data
            count = 0;
            searchResultsDiv.childNodes.forEach(function (child) {
                searchResultsDiv.removeChild(child);
            });

            var ul = document.createElement("ul");
            var list = data.map(function (text) {
                // addListItem(count, text, ul);
                // count++;
                React.createElement(
                    'li',
                    null,
                    element
                );
            });
            console.log(list);
            // searchResultsDiv.appendChild(ul);
            ReactDOM.render(React.createElement(
                'ul',
                null,
                list
            ), document.getElementById('searchResultsDiv'));
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

function addListItem(index, text, ul) {
    return React.createElement(
        'li',
        null,
        text
    );
    // var li = document.createElement("li");
    // li.setAttribute('id','searchResultsDiv_id' + index);
    // li.appendChild(document.createTextNode(text));
    // ul.appendChild(li);
}

module.exports = buttonTapped;