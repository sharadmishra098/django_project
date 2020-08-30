import csv
import os
from django.apps import apps
from django.core.management.base import BaseCommand, CommandError
from ipl_app.models import Delivery, Umpire, Match


class Command(BaseCommand):
    help = ""

    def get_current_app_path(self):
        return apps.get_app_config('ipl_app').path

    def get_csv_file(self, filename):
        app_path = self.get_current_app_path()
        file_path = os.path.join(app_path, "management", "commands", filename)
        return file_path

    def handle(self, *args, **options):
        file_path = self.get_csv_file("data/deliveries.csv")
        try:
            with open(file_path, 'r') as csv_file:
                csv_reader = csv.reader(csv_file)
                next(csv_reader)
                object_list = []
                for record in csv_reader:
                    delivery_obj = Delivery(
                        match_id=int(record[0]),
                        inning=record[1],
                        batting_team=record[2],
                        bowling_team=record[3],
                        over=int(record[4]),
                        ball=int(record[5]),
                        batsman=record[6],
                        non_striker=record[7],
                        bowler=record[8],
                        is_super_over=int(record[9]),
                        wide_runs=int(record[10]),
                        bye_runs=int(record[11]),
                        legbye_runs=int(record[12]),
                        noball_runs=int(record[13]),
                        penalty_runs=int(record[14]),
                        batsman_runs=int(record[15]),
                        extra_runs=int(record[16]),
                        total_runs=int(record[17]),
                        player_dismissed=record[18],
                        dismissal_kind=record[19],
                        fielder=record[20],
                    )
                    object_list.append(delivery_obj)
                Delivery.objects.bulk_create(object_list)
        except FileNotFoundError:
            raise CommandError("File {} does not exist".format(
                    file_path))

        file_path = self.get_csv_file("data/matches.csv")
        try:
            with open(file_path, 'r') as csv_file:
                csv_reader = csv.reader(csv_file)
                next(csv_reader)
                object_list = []
                for record in csv_reader:
                    match_obj = Match(
                        season=int(record[1]),
                        city=record[2],
                        date=record[3],
                        team1=record[4],
                        team2=record[5],
                        toss_winner=record[6],
                        toss_decision=record[7],
                        result=record[8],
                        dl_applied=int(record[9]),
                        winner=record[10],
                        win_by_runs=int(record[11]),
                        win_by_wickets=int(record[12]),
                        player_of_match=record[13],
                        venue=record[14],
                        umpire1=record[15],
                        umpire2=record[16],
                        umpire3=record[17],
                    )
                    object_list.append(match_obj)
                Match.objects.bulk_create(object_list)
        except FileNotFoundError:
            raise CommandError("File {} does not exist".format(
                    file_path))

        file_path = self.get_csv_file("data/umpires.csv")
        try:
            with open(file_path, 'r') as csv_file:
                csv_reader = csv.reader(csv_file)
                next(csv_reader)
                object_list = []
                for record in csv_reader:
                    umpire_obj = Umpire(
                        umpire=record[0],
                        nationality=record[1],
                    )
                    object_list.append(umpire_obj)
                Umpire.objects.bulk_create(object_list)
        except FileNotFoundError:
            raise CommandError("File {} does not exist".format(
                    file_path))
