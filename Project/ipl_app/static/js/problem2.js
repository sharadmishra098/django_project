var rangeByCategory = {
    0: ["100", "200", "300", "500", "1000", "1500", "2000", "2500", "3000", "3500", "4000", "4500"],
    500: ["1000", "1500", "2000", "2500", "3000", "3500", "4000", "4500"],
    1000: ["1500", "2000", "2500", "3000", "3500", "4000", "4500"],
    1500: ["2000", "2500", "3000", "3500", "4000", "4500"],
    2000: ["2500", "3000", "3500", "4000", "4500"],
    2500: ["3000", "3500", "4000", "4500"],
    3000: ["3500", "4000", "4500"],
    3500: ["4000", "4500"],
    4000: ["4500"]
}

function changecat(value) {
    if (value.length == 0) document.getElementById("end").innerHTML = "<option></option>";
    else {
        var catOptions = "";
        for (categoryId in rangeByCategory[value]) {
            catOptions += "<option " + "value='" + rangeByCategory[value][categoryId] + "'>" + rangeByCategory[value][categoryId] + "</option>";
        }
        document.getElementById("end").innerHTML = catOptions;
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken')
var selected_batsman = []
var start = 0
var end = 4500
fetch_json()

var form = document.getElementById("form1")
form.addEventListener('submit', function(e) {
    e.preventDefault()
    get_data()
});

function get_data() {
    start = document.forms['form1'].elements['start'].value
    end = document.forms['form1'].elements['end'].value
    selected_batsman = [];
    for (var option of document.getElementById('batsman').options) {
        if (option.selected) {
            selected_batsman.push(option.value);
        }
    }
    console.log(selected_batsman)
    console.log(start)
    console.log(end)
    fetch_json()
}

function fetch_json() {
    url = 'http://127.0.0.1:8000/plot2/'
    data = { selected_batsman, start, end }
    fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
        .then((data) => {
            plot_chart(data)
        })
}

function plot_chart(data) {
    Highcharts.chart("container", {
        chart: {
            type: 'column'
        },
        title: {
            text: 'RCB Batsman V/S their Scores'
        },
        xAxis: {
            categories: Object.keys(data),
            crosshair: true,
            title: {
                text: 'Batsman'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Runs Scored'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} runs</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'scores',
            data: Object.values(data)

        }]
    });
}