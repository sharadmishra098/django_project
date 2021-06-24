# Djando Data Project- IPL
Analysis of IPL data.
## Built Using
* HTML
* CSS
* Javascript
* Bootstrap
* Python3
* Django
## Database Used
* PostgreSQL Database

## Create Virtual environment
1. Install virual environment
   > pip install virtualenv
2. Create a virual environment
   > virtualenv environment_name
3. Activate the virual environment
   > source environment_name/bin/activate

## Install the requiremnts
> pip install -r requirements.txt

## Steps to Run the Project
1. Give your database superuser credentials in ```.env``` file.
2. Create the database.
   > python3 create_db.py
3. Now go to ```Project``` directory.
   > cd Project
4. Create tables.
   > python manage.py makemigrations \
   > python manage.py migrate
5. Load CSV data in tables.
   > python manage.py load_data
6. Start the server.
   > python manage.py runserver
7. Open the link generated in above step to see the results.
8. Press ```Ctrl+C``` to quit the server.
9. To delete the database, get back to the root directory of the project and run
   > python3 delete_db.py
10. Now deactivate the virtual environment by ```deactivate``` command.
   
# Author
Sharad Mishra - _sharad.mishra@mountblue.tech_
