# meansilo
Mean Silo. Basic MEAN app framework with Admin (and login).

It's very basic, no user management.

Install the project

    git clone https://github.com/nikolayhsu/meansilo.git
    cd meansilo && npm install

Start 'er up

    sudo ./run.sh
    

You can find all the config settings under ( This should serve all your app.get() requests automatically )

    /app/server.js


To enable Nodemailer

    Login as admin

    Click on Admin in the top menu

    Set 'Enable System Email' to Yes 

    Set up your email host, port, secure mode, email address and password.

    Click Submit to save the setting

To enable Facebook Login

    Login as admin

    Click on Admin in the top menu

    Set 'Enable Facebook Login' to Yes 

    Set up your Facebook application ID

    Click Submit to save the setting


The "admin" user is created if it doesn't exist. Set the details in:

    # /app/server.js
    ...
    var adminUsername = "admin";
    var adminPassword = "password";
