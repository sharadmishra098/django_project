"""This file is to create database if it doesn't exist"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy_utils import create_database, database_exists

load_dotenv()


def make_db():
    """Function to create database"""
    user = os.getenv("USER_NAME")
    password = os.getenv("PASSWORD")
    url = 'postgresql://'+user+':'+password+'@localhost/ipl_data'
    engine = create_engine(url)
    if not database_exists(engine.url):
        create_database(engine.url)
    if database_exists(engine.url):
        print("Database created successfully")


if __name__ == "__main__":
    make_db()
