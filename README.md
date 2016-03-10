# meansilo
Mean Silo. Basic MEAN app framework with Admin (and login).

Its very basic, no user management.

Install the project

    git clone https://github.com/buzzcloudau/meansilo.git
    cd meansilo && npm install


Start 'er up

    sudo ./run.sh
    

You can find all the config settings under

    /app/server.js


After first run, you might want to comment out the following, or it will reset the admin on each server start

    db.collection('users').update({ "username" : adminUsername }
							, { "username" : adminUsername , "password" : adminPassword }
							, { upsert: true } 
							);
