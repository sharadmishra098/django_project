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
var selected_seasons = []
var selected_teams = []
fetch_json()

var form = document.getElementById("form1")
form.addEventListener('submit', function(e) {
    e.preventDefault()
    get_data()
});

function get_data() {
    selected_seasons = [];
    for (var option of document.getElementById('season').options) {
        if (option.selected) {
            selected_seasons.push(option.value);
        }
    }
    console.log(selected_seasons)
    selected_teams = [];
    for (var option of document.getElementById('team').options) {
        if (option.selected) {
            selected_teams.push(option.value);
        }
    }
    console.log(selected_teams)
    fetch_json()
}

function fetch_json() {
    url = 'http://127.0.0.1:8000/plot4/'
    data = { selected_seasons, selected_teams }
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
    series_data_list = []
    if (selected_teams) {
        var teams = selected_teams
    } else {
        teams = ['Gujarat Lions', 'Rising Pune Supergiant',
            'Royal Challengers Bangalore',
            'Kolkata Knight Riders', 'Delhi Daredevils',
            'Sunrisers Hyderabad',
            'Kings XI Punjab', 'Mumbai Indians', 'Chennai Super Kings',
            'Rajasthan Royals', 'Deccan Chargers', 'Pune Warriors',
            'Kochi Tuskers Kerala'
        ]
    }
    //var teams = selected_teams
    var team_list = [];
    for (var year of Object.keys(data)) {
        let score = [];
        for (var team of teams) {
            if (data[year].hasOwnProperty(team)) {
                score.push(data[year][team]);
            } else {
                score.push(0)
            }
        }
        team_list.push(score);
        series_dict = {
            name: year,
            data: score
        }
        series_data_list.push(series_dict)
    }
    Highcharts.chart("container", {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Games played by teams per season'
        },
        xAxis: {
            categories: teams,
            crosshair: true,
            title: {
                text: 'Teams'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'No. of games'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
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
                borderWidth: 0,
                stacking: 'normal',
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: series_data_list
    });
}