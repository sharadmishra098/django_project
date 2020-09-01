var start = 0
var end = 30000
    //var teams = ['Kochi Tuskers Kerala', 'Rising Pune Supergiant', 'Gujarat Lions', 'Pune Warriors', 'Deccan Chargers', 'Sunrisers Hyderabad', 'Rajasthan Royals', 'Chennai Super Kings', 'Delhi Daredevils', 'Kolkata Knight Riders', 'Kings XI Punjab', 'Royal Challengers Bangalore', 'Mumbai Indians']
var selected_team = []

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
fetch_json()

var form = document.getElementById("form1")
form.addEventListener('submit', function(e) {
    e.preventDefault()
    get_data()
});

function get_data() {
    start = document.forms['form1'].elements['start'].value
    end = document.forms['form1'].elements['end'].value
    team_inputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    selected_team = []
    for (let item in team_inputs) {
        if (document.getElementById(item).checked) {
            selected_team.push(document.getElementById(item).value)
        }
    }
    fetch_json()
    console.log(start)
    console.log(end)
    console.log(selected_team)
}

function fetch_json() {
    url = 'http://127.0.0.1:8000/plot1/'
    data = { selected_team, start, end }
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
            text: 'Teams V/S their Scores'
        },
        xAxis: {
            categories: Object.keys(data),
            crosshair: true
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
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
            name: 'Teams',
            data: Object.values(data)

        }]
    });
}