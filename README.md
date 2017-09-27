LDAP Admin Panel
--------

###Installation

Before intallation you need to set LDAP Serve IP Address in /app/config.js.
(Also, you can add as much servers as you want. To run another server you need to change it in /app/routes.js and
/app/routesClient.js).
```
servers': {
    'ldap1': 'ldap://192.168.1.198:389'
}
```

1.Server
```
$ npm install
$ npm start
```
2.Admin
```
$ cd ng2-admin/
$ npm install
$ ng serve
```
2.Client
```
$ cd ng2-client/
$ npm install
$ ng serve
```
###Accept changes

```
ng2-admin/$ ng build
ng2-client/$ ng build
```

###OR  if you don't want to change client side (also for final release)

```
$ cd ng2-admin/
ng2-admin/$ npm install
ng2-admin/$ ng build
ng2-admin/$ cd ..
$ cd ng2-client/
ng2-client/$ npm install
ng2-client/$ ng build
ng2-client/$ cd ..
$ npm install
$ npm start
```

###Docker setup

```
$ docker build -t <docker_image name> .
$ docker run -p 3000:3000 <docker_image name>
```