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


To enable Nodemailer

    Go to /app/modules/auth.js

    Set up your email address and password in line 445 & 446

To enable Facebook Login

    Go to /app/app/app.js

    Set up your Facebook application ID in line 64


The "admin" user is created if it doesn't exist. Set the details in:

    # /app/server.js
    ...
    var adminUsername = "admin";
    var adminPassword = "password";
