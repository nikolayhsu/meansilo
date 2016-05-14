# meansilo
Mean Silo. Basic MEAN app framework with Admin (and login).

Its very basic, no user management.

Install the project

    git clone https://github.com/buzzcloudau/meansilo.git
    cd meansilo && npm install


Start 'er up

    sudo ./run.sh
    

You can find all the config settings under ( This should serve all your app.get() requests automatically )

    /app/server.js


Create modules for your app.post() requests in drop them into the appropiate folders

    /app/public/modules/
    /app/admin/modules/


The "admin" user is created if it doesn't exist. Set the details in:

    # /app/server.js
    ...
    var adminUsername = "admin";
    var adminPassword = "password";
