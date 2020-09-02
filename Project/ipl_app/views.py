from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Sum, Count, Q

from .models import Delivery, Umpire, Match
# Create your views here.


def home_view(request):
    return render(request, "home.html", {})


def total_team_runs(request):
    url_data = request.GET['data']
    input_data = list(url_data.split(','))
    selected_team = input_data[:-2]
    start, end = list(filter(lambda x: x.isdigit(), input_data))

    if selected_team:
        dataset = (
            Delivery.objects.values('batting_team')
            .filter(batting_team__in=selected_team)
            .annotate(total_runs=Sum('total_runs'))
            .filter(total_runs__gte=start, total_runs__lte=end)
            .order_by('-total_runs')
        )
    else:
        dataset = (
            Delivery.objects.values('batting_team')
            .annotate(total_runs=Sum('total_runs'))
            .filter(total_runs__gte=start, total_runs__lte=end)
            .order_by('-total_runs')
        )

    dict_data = {}
    for entry in dataset:
        dict_data[entry['batting_team']] = entry['total_runs']

    return JsonResponse(dict_data)


def team_total(request):
    dataset = Delivery.objects.values("batting_team")\
        .annotate(total_runs=Sum("total_runs"))\
        .order_by("total_runs")

    dict_data = {}
    for entry in dataset:
        dict_data[entry['batting_team']] = entry['total_runs']
    return render(request, "problem1.html", {'dict_data': dict_data})


def rcb_batsman(request):
    dataset = (
        Delivery.objects.values('batsman')
        .filter(batting_team='Royal Challengers Bangalore')
        .annotate(batsman_runs=Sum('batsman_runs'))
        .order_by('-batsman_runs')
    )
    dict_data = {}
    for entry in dataset:
        dict_data[entry['batsman']] = entry['batsman_runs']
    return render(request, "problem2.html", {'dict_data': dict_data})


def rcb_batsman_plot(request):
    url_data = request.GET['data']
    input_data = list(url_data.split(','))
    selected_batsman = input_data[:-2]
    start, end = list(filter(lambda x: x.isdigit(), input_data))

    if selected_batsman:
        dataset = (
            Delivery.objects.values('batsman')
            .filter(batting_team='Royal Challengers Bangalore')
            .filter(batsman__in=selected_batsman)
            .annotate(batsman_runs=Sum('batsman_runs'))
            .filter(batsman_runs__gte=start, batsman_runs__lte=end)
            .order_by('-batsman_runs')
        )
    else:
        dataset = (
            Delivery.objects.values('batsman')
            .filter(batting_team='Royal Challengers Bangalore')
            .annotate(batsman_runs=Sum('batsman_runs'))
            .filter(batsman_runs__gte=start, batsman_runs__lte=end)
            .order_by('-batsman_runs')
        )
    dict_data = {}
    for entry in dataset:
        dict_data[entry['batsman']] = entry['batsman_runs']

    return JsonResponse(dict_data)


def umpire(request):
    dataset = (
        Umpire.objects.values('nationality')
        .exclude(nationality='India')
        .annotate(count=Count('nationality'))
        .order_by('-count')
    )
    dict_data = {}
    for entry in dataset:
        dict_data[entry['nationality']] = entry['count']
    return render(request, "problem3.html", {'dict_data': dict_data})


def umpire_plot(request):
    url_data = request.GET['data']
    input_data = list(url_data.split(','))

    selected_country = input_data
    print(selected_country)
    if selected_country:
        dataset = (
            Umpire.objects.values('nationality')
            .exclude(nationality='India')
            .filter(nationality__in=selected_country)
            .annotate(count=Count('nationality'))
            .order_by('-count')
        )
    else:
        dataset = (
            Umpire.objects.values('nationality')
            .exclude(nationality='India')
            .annotate(count=Count('nationality'))
            .order_by('-count')
        )
    dict_data = {}
    for entry in dataset:
        dict_data[entry['nationality']] = entry['count']
    return JsonResponse(dict_data)


def season(request):
    dataset = (
        Match.objects.values('season', 'team1', 'team2')
        .order_by('season')
    )
    teams_data = Match.objects.values('team1').distinct()
    teams = [entry['team1'] for entry in teams_data]
    dict_data = {}
    for entry in dataset:
        if entry['season'] not in dict_data:
            dict_data[entry['season']] = {}
        else:
            dict_data[entry['season']][entry['team1']] =\
                dict_data[entry['season']].get(entry['team1'], 0) + 1
            dict_data[entry['season']][entry['team2']] =\
                dict_data[entry['season']].get(entry['team2'], 0) + 1
    return render(request, 'problem4.html', {
        'dict_data': dict_data,
        'teams': teams
    })


def season_plot(request):
    url_data = request.GET['data']
    input_data = list(url_data.split(','))
    selected_seasons = [x for x in input_data if x.isdigit()]
    selected_teams = [x for x in input_data if not x.isdigit()]

    if selected_seasons or selected_teams:
        dataset = (
            Match.objects.values('season', 'team1', 'team2')
            .filter(season__in=selected_seasons)
            .filter(Q(team1__in=selected_teams) |
                    Q(team2__in=selected_teams))
            .order_by('season')
        )
        dict_data = {}
        for entry in dataset:
            if entry['season'] not in dict_data:
                dict_data[entry['season']] = {}
            else:
                dict_data[entry['season']][entry['team1']] =\
                    dict_data[entry['season']].get(entry['team1'], 0) + 1
                dict_data[entry['season']][entry['team2']] =\
                    dict_data[entry['season']].get(entry['team2'], 0) + 1
    else:
        dataset = (
            Match.objects.values('season', 'team1', 'team2')
            .order_by('season')
        )
        dict_data = {}
        for entry in dataset:
            if entry['season'] not in dict_data:
                dict_data[entry['season']] = {}
            else:
                dict_data[entry['season']][entry['team1']] =\
                    dict_data[entry['season']].get(entry['team1'], 0) + 1
                dict_data[entry['season']][entry['team2']] =\
                    dict_data[entry['season']].get(entry['team2'], 0) + 1
    return JsonResponse(dict_data)
