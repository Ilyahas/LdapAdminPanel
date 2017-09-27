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

    app.get('/backup', this.isAuth, (req, res) => {
        this.backupSearch('dc=' + config.domainName + ',dc=' + config.postDomain, res);
    });

    app.get('/isAdmin', (req, res) => {
        const token = req.headers['authorization'];
        if (!token) {
            res.json({ success: false, message: 'No token provided' });
        } else {
            jwt.verify(token, config.admin_secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
                } else {
                    req.decoded = decoded;
                    res.json({ success: true, message: 'Token invalid: ' + err });
                }
            });
        }
    });

    /** USERS **/

    app.get('/getUsers', this.isAuth, (req, res) => {
        let opts = {
            filter: '(&(mail=*@*)(accountStatus=active))',
            scope: 'sub'
        };
        this.search(opts, "Users", res);
    });

    app.get('/getHiddenUsers', this.isAuth, (req, res) => {
        let opts = {
            filter: '(&(mail=*@*)(accountStatus=false))',
            scope: 'sub'
        };
        this.search(opts, "Users", res);
    });

    app.get('/getDeletedUsers', this.isAuth, (req, res) => {
        let opts = {
            filter: '(&(mail=*@*)(accountStatus=disabled))',
            scope: 'sub'
        };
        this.search(opts, "Users", res);
    });

    app.post('/updateData', this.isAuth, (req, res) => {
        this.update(req, res);
    });

    app.post('/updateDataHiddenUser', this.isAuth, (req, res) => {
        this.update(req, res);
        change = new ldap.Change({
            operation: 'replace',
            modification: {
                uid: req.body.uid
            }
        });
        this.mod(req.body.dn, change, "Can't update givenName.", res);

        let mailForDn = req.body.uid + '@freshcode.org';
        client.modifyDN(req.body.dn, 'mail=' + mailForDn, function(err) {
            if(err) {
                console.log(err);
                res.status(400).send("Can't update user's mail");
            }
            else {
                res.status(200).end();
            }
        });
    });

    app.post('/addUser', this.isAuth, (req, res) => {
        let entry = {
            cn: req.body.givenName + " " + req.body.sn,
            sn: req.body.sn,
            uid: req.body.uid,
            mail: req.body.uid + "@freshcode.org",
            givenName: req.body.givenName,
            homeDirectory: config.homeDirectory + req.body.uid[0] + '/' + req.body.uid[1] + '/' + req.body.uid[2] + '/' +
                req.body.uid,
            mailMessageStore: config.mailMessageStore + req.body.uid[0] + '/' + req.body.uid[1] + '/' + req.body.uid[2] + '/' +
                req.body.uid,
            accountStatus: 'false',
            enabledService: this.analysisBooleanData(req.body),
            shadowAddress: this.getShadowAddress(req.body.shadowAddress),
            objectClass: ['inetOrgPerson', 'shadowAccount', 'amavisAccount', 'mailUser', 'top'],
            userPassword: ssha.create(req.body.userPassword)
        };
        let opts = {
            filter: '(&(mail=*@*)(accountStatus=active))',
            scope: 'sub'
        };
        this.addAsUnique(opts, entry, "Users", res);
    });



    app.post('/delUser', this.isAuth, (req, res) => {
        change = new ldap.Change({
            operation: 'replace',
            modification: {
                accountStatus: 'disabled'
            }
        });
        this.mod(req.body.dn, change, "Can't update status.", res);
    });

    app.post('/activeUser', this.isAuth, (req, res) => {
        change = new ldap.Change({
            operation: 'replace',
            modification: {
                accountStatus: 'active'
            }
        });
        this.mod(req.body.dn, change, "Can't update status.", res);
    });

    app.post('/updateUserPassword', this.isAuth, (req, res) => {
        change = new ldap.Change({
            operation: 'replace',
            modification: {
                userPassword: ssha.create(req.body.userPassword)
            }
        });
        this.mod(req.body.dn, change, "Can't update password.", res);
    });

    /** ALIASES **/

    app.get('/getAliases', this.isAuth, (req, res) => {
        let opts = {
            filter: '(&(mail=*@*)(accountStatus=active))',
            scope: 'sub'
        };
        this.search(opts, "Aliases", res);
    });

    app.post('/addAlias', this.isAuth, (req, res) => {
        let entry = {
            cd: req.body.uid,
            mail: req.body.uid + "@freshcode.org",
            accountStatus: 'active',
            mailForwardingAddress: req.body.mailForwardingAddress,
            objectClass: ['mailAlias', 'top']
        };
        let opts = {
            filter: '(&(mail=*@*)(accountStatus=true))',
            scope: 'sub'
        };
        this.addAsUnique(opts, entry, "Aliases", res);
    });

    app.post('/delAlias',this.isAuth, (req, res) => {
        this.del(req.body.dn, "Alias", res);
    });

    app.post('/updateAlias', this.isAuth, (req, res) => {
        change = new ldap.Change({
            operation: 'replace',
            modification: {
                mailForwardingAddress: req.body.mailForwardingAddress
            }
        });
        this.mod(req.body.dn, change, "Can't update mailForwardingAddress.", res);
    });
};


exports.isAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        res.json({ success: false, message: 'No token provided' });
    } else {
        jwt.verify(token, config.admin_secret, (err, decoded) => {
            if (err) {
                res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
            } else {
                req.decoded = decoded;
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
            token = jwt.sign({user: req.body.username}, config.admin_secret, {expiresIn: '12h'});
        }
    }.bind(this));
    setTimeout(function(){res.send({binded: binded , token: token, username: req.body.username});}, 100);
};

exports.search = (opts, ouValue, res1) => {
    let arr = [];
    client.search('ou=' + ouValue + ',domainName=' + config.domainName + '.' + config.postDomain +
        ',o=domains,dc=' + config.domainName + ',dc=' + config.postDomain, opts, function(err, res) {
        res.on('searchEntry', function(entry) {
            const {givenName, sn, mail, shadowAddress, enabledService, dn, uid} = entry.object;
            arr.push({givenName, sn, mail, shadowAddress, enabledService, dn, uid});
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
exports.analysisBooleanData = (data) => {
    booleanArray = [
        'smtp',
        'deliver',
        'forward',
        'senderbcc',
        'recipientbcc',
        'shadowaddress',
        'displayedInGlobalAddressBook',
        'doveadm',
        'dsync',
        'imap',
        'imapsecured',
        'indexer-worker',
        'internal',
        'lda',
        'lib-storage',
        'lmtp',
        'managesieve',
        'managesievesecured',
        'pop3',
        'pop3secured',
        'sieve',
        'sievesecured',
        'smtpsecured',
        'sogo'
    ];
    if(data.isChat) {
        booleanArray[booleanArray.length] = 'chat';
    }
    if(data.isGit) {
        booleanArray[booleanArray.length] = 'git';
    }
    if(data.isPost) {
        booleanArray[booleanArray.length] = 'mail';
    }
    if(data.isFile) {
        booleanArray[booleanArray.length] = 'cloud';
    }
    if(booleanArray.length === 0){
        booleanArray[0] = '';
    }
    return booleanArray;
};
exports.addAsUnique = (opts, entry, ouValue, res1) => {
    let arr = [];
    let isUnique = true;
    client.search('dc=' + config.domainName + ',dc=' + config.postDomain, opts, function(err, res) {
        res.on('searchEntry', function(entry) {
            arr.push(entry.object);
        });
        res.on('searchReference', function(referral) {
            console.log('referral: ' + referral.uris.join());
        });
        res.on('error', function(err) {
            console.error('error: ' + err.message);
        });
        res.on('end', function(result) {
            console.log('status: ' + result.status);
            for (let i = 0; i < arr.length; ++i) {
                if(arr[i].mail === entry.mail){
                    isUnique = false;
                }
            }
            if(isUnique) {
                client.add("mail=" + entry.mail + ",ou="+ ouValue + ",domainName=" + config.domainName +
                    ".org,o=domains,dc=" + config.domainName + ",dc=" + config.postDomain, entry, function (err) {
                    if (err) {
                        console.log();
                        res1.status(400).send("Can't add user. " + err);
                    }
                    else {
                        res1.status(200).end();
                    }
                });
            }
            else {
                res1.status(400).send("Login is exists.");
            }
        });
    });
};
exports.del = (dn, ou, res) => {
    client.del(dn, function(err) {
        if(err) {
            console.log(err);
            res.status(400).send(ou + " was deleted");
        }
        else {
            res.status(200).end();
        }
    });
};
exports.addPostfix = (data) => {
    let tempArr = [];
    for (let i = 0; i < data.length; ++i){
        tempArr[tempArr.length] = data[i] + config.postfix;
    }
    return tempArr;
};
exports.update = (req, res) => {
    change = new ldap.Change({
        operation: 'replace',
        modification: {
            givenName: req.body.givenName
        }
    });
    this.mod(req.body.dn, change, "Can't update givenName.", res);

    change = new ldap.Change({
        operation: 'replace',
        modification: {
            sn: req.body.sn
        }
    });
    this.mod(req.body.dn, change, "Can't update sn.", res);

    change = new ldap.Change({
        operation: 'replace',
        modification: {
            homeDirectory: config.homeDirectory
        }
    });
    this.mod(req.body.dn, change, "Can't update homeDirectory.", res);

    change = new ldap.Change({
        operation: 'replace',
        modification: {
            shadowAddress: this.addPostfix(req.body.shadowAddress)
        }
    });
    this.mod(req.body.dn, change, "Can't update shadowAddresses.", res);

    change = new ldap.Change({
        operation: 'replace',
        modification: {
            mailMessageStore: config.mailMessageStore
        }
    });
    this.mod(req.body.dn, change, "Can't update mailMessageStore.", res);

    change = new ldap.Change({
        operation: 'replace',
        modification: {
            enabledService: this.analysisBooleanData(req.body)
        }
    });
    this.mod(req.body.dn, change, "Can't update enabledService.", res);
};

exports.getDN = (fullDN) => {
    const newDnArr = fullDN.split(',');
    let newDnStr  = '';
    for (let i = 1; i < newDnArr.length; ++i){
        newDnStr += newDnArr[i] + ",";
    }
    return newDnStr;
};
exports.backupSearch = (path, res1) => {
    let arr = [];
    const opts = {
        scope: 'sub'
    };
    client.search(path, opts, function(err, res) {
        res.on('searchEntry', function(entry) {
            arr.push(entry.object);
        });
        res.on('searchReference', function(referral) {
            console.log('referral: ' + referral.uris.join());
        });
        res.on('error', function(err) {
            console.error('error: ' + err.message);
        });
        res.on('end', function(result) {
            console.log('status: ' + result.status);
            res1.send(arr);
        });
    });
};
exports.getShadowAddress = (shadowAddress) => {
    if(!shadowAddress.length){
        return ""
    } else {
        return shadowAddress + "@freshcode.org";
    }
};