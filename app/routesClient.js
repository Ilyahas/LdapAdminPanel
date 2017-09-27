const ldap = require('ldapjs');
const jwt = require('jsonwebtoken');
const config = require('./config');
const client = ldap.createClient({
    url: config.servers.ldap1
});
const opts = {
    scope: 'sub'
};
const ssha = require("ssha");

module.exports = (app) => {
    app.post('/login', this.log);

    app.get('/logout', (req, res) => {
        client.unbind(function(err) {
            if(!err){
                res.status(200).end();
            }
        });
    });

    app.post('/getUser', this.isAuth, (req, res) => {
        let temp = req.currentUser.split(',');
        let opts = {
            filter: '(&(' + temp[0] + ')(accountStatus=active))',
            scope: 'sub',
        };
        this.searchUser(opts, res);
    });

    app.post('/updateData', this.isAuth, (req, res) => {
        this.update(req, res);
    });

    app.post('/updateUserPassword', this.isAuth, (req, res) => {
        change = new ldap.Change({
            operation: 'replace',
            modification: {
                userPassword: ssha.create(req.body.userPassword)
            }
        });
        this.mod(req.currentUser, change, "Can't update userPassword.", res);
    });

};

exports.userByTocken = [];
exports.checkUserTocken = (currentUser) => {
    for (let i = 0; i < this.userByTocken.length; ++i) {
        if(this.userByTocken[i].user === currentUser){
            this.userByTocken.slice(i, 1);
            return;
        }
    }
};
exports.findUser = (tocken) => {
    for (let i = 0; i < this.userByTocken.length; ++i) {
        if(this.userByTocken[i].tocken === tocken){
            return this.userByTocken[i].user;
        }
    }
};

exports.isAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        res.json({ success: false, message: 'No token provided' });
    } else {
        jwt.verify(token, config.user_secret, (err, decoded) => {
            if (err) {
                res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
            } else {
                req.decoded = decoded;
                req.currentUser = this.findUser(token);
                next();
            }
        });
    }
};

exports.log = (req, res) => {
    let token = '';
    let binded = false;
    client.bind(req.body.username, req.body.password, function (err) {
        if(!err) {
            binded = true;
            token = jwt.sign({user: req.body.username}, config.user_secret, {expiresIn: '12h'});
            this.checkUserTocken(req.body.username);
            this.userByTocken.push({user: req.body.username, tocken: token});
        }
    }.bind(this));
    setTimeout(function(){
        if(binded) {
            client.bind(config.usernameclient, config.usernamepassword, function (err) {
                if(!err) {
                    binded = true;
                }
                else {
                    console.log(err);
                }
            }.bind(this));
        }
        setTimeout(function() {
            res.send({binded: binded, token: token, username: req.body.username});
        }, 100);
    }, 100);
};

exports.searchUser = (opts, res1) => {
    let arr;
    client.search('ou=Users,domainName=' + config.domainName + '.org,o=domains,dc=' + config.domainName + ',dc=' + config.postDomain,
        opts, function(err, res) {
        res.on('searchEntry', function(entry) {
            const {givenName, sn, mail} = entry.object;
            arr = {givenName, sn, mail};
        });
        res.on('searchReference', function(referral) {
            console.log('referral: ' + referral.uris.join());
        });
        res.on('error', function(err) {
            console.error('error: ' + err.message);
            res1.status(400).send("error");
        });
        res.on('end', function(result) {
            console.log('status: ' + result.status);
            res1.send(arr);
        });
    });
};
exports.update = (req, res) => {
    change = new ldap.Change({
        operation: 'replace',
        modification: {
            givenName: req.body.givenName
        }
    });
    this.mod(req.currentUser, change, "Can't update givenName.", res);

    change = new ldap.Change({
        operation: 'replace',
        modification: {
            sn: req.body.sn
        }
    });
    this.mod(req.currentUser, change, "Can't update sn.", res);

    change = new ldap.Change({
        operation: 'replace',
        modification: {
            cn: req.body.givenName + ' ' + req.body.sn
        }
    });
    this.mod(req.currentUser, change, "Can't update cn.", res);

};
exports.mod = (dn, change, msg, res) => {
    client.modify(dn, change, (err) => {
        if(err) {
            console.log(err);
            res.status(400).send(msg);
        }
        else {
            res.status(200).end();
        }
    });
};