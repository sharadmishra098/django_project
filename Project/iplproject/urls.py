"""iplproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from ipl_app.views import (
    home_view,
    team_total,
    total_team_runs,
    rcb_batsman,
    rcb_batsman_plot,
    umpire,
    umpire_plot,
    season,
    season_plot
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view, name='home'),
    path('problem1/', team_total, name='problem1'),
    path('plot1/', total_team_runs, name='plot1'),
    path('problem2/', rcb_batsman, name='problem2'),
    path('plot2/', rcb_batsman_plot, name='plot2'),
    path('problem3/', umpire, name='problem3'),
    path('plot3/', umpire_plot, name='plot3'),
    path('problem4/', season, name='problem4'),
    path('plot4/', season_plot, name='plot4'),
]
