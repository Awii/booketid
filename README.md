# Booketid 

Multi-purpose web application for reservations with a simple CMS for adding/changing services and opening hours with a calendar for existing reservations.

## Description

Client-sided application using Firebase Firestore (NoSQL) for storing services, opening hours and reservations. New sites addable from ```src/sites.js```, containing static data like location, contact information, social links etc. Corresponding admins addable from ```src/users.js```. 

Tablet front-page             |  Admin calendar
:-------------------------:|:-------------------------:
![](https://i.imgur.com/oNiHDtx.png)  |  ![](https://i.imgur.com/7D6Nxms.png)

## Project 
[![Netlify Status](https://api.netlify.com/api/v1/badges/543baa4e-1a54-4256-aa77-1ae71b3fa036/deploy-status)](https://app.netlify.com/sites/booketid/deploys)

[Demo website](https://booketid.netlify.app/demo)

Admin details: 

E-mail: ```demo@user.com```
Password: ```demo123```

## Project setup


Install dependencies: ```npm install```

Setup ```src/plugins/firebaseConfig.js``` with your own Firebase config

Run local server: ```npm run serve```

### Production setup
Setup write rules in Firebase.

## Future work
* Change opening hours for specific days or weeks
* Design overhaul

## License
MIT
