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
var selected_country = []
fetch_json()

var form = document.getElementById("form1")
form.addEventListener('submit', function(e) {
    e.preventDefault()
    get_data()
});

function get_data() {
    selected_country = [];
    for (var option of document.getElementById('country').options) {
        if (option.selected) {
            selected_country.push(option.value);
        }
    }

    fetch_json()
}
console.log(selected_country)

function fetch_json() {
    url = 'http://127.0.0.1:8000/plot3/'
    data = { selected_country }
    fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
        .then((data) => {
            console.log(data['selected_country'])
            plot_chart(data)
        })
}

function plot_chart(data) {
    console.log(Object.keys(data))
    Highcharts.chart("container", {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Countries V/S number of umpires'
        },
        xAxis: {
            categories: Object.keys(data),
            crosshair: true,
            title: {
                text: 'Countries'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Umpires'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
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
            name: 'No. of Umpires',
            data: Object.values(data)

        }]
    });
}