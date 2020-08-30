import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy_utils import drop_database, database_exists

load_dotenv()


def make_db():
    """Function to create database"""
    url = os.getenv("DATABASE_URL")
    engine = create_engine(url)
    if database_exists(engine.url):
        drop_database(engine.url)
        print("Database deleted")


if __name__ == "__main__":
    make_db()
