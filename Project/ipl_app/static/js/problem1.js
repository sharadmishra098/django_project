var rangeByCategory = {
    0: ["5000", "10000", "15000", "20000", "25000", "30000"],
    5000: ["10000", "15000", "20000", "25000", "30000"],
    10000: ["15000", "20000", "25000", "30000"],
    15000: ["20000", "25000", "30000"],
    20000: ["25000", "30000"],
    25000: ["30000"]
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
var selected_team = []
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
    var data = [selected_team, start, end]
    var url = `http://127.0.0.1:8000/plot1?data=${data}`
    fetch(url).then(response => response.json().then(function(data) {
        plot_chart(data);
    }));
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
            crosshair: true,
            title: {
                text: 'Teams'
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
            name: 'Scores',
            data: Object.values(data)

        }]
    });
}