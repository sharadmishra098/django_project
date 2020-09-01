import json
from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Sum

from .models import Delivery
# Create your views here.


def home_view(request):
    return render(request, "home.html", {})


def total_team_runs(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode("utf-8"))
        start = int(data['start'])
        end = int(data['end'])
        selected_team = data['selected_team']
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
