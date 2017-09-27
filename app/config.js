module.exports = {
    'servers': {
        'ldap1': 'ldaps://mail.freshcode.org:636'
    },
    'listen' : '3000',
    'prefAdmin' : '/admin',
    'prefClient' : '/',
    'admin_secret': 'ndsecret',
    'user_secret': 'ndsecretclient',
    'postfix': '@freshcode.org',
    'homeDirectory': '/var/vmail/vmail1/freshcode.org/',
    'mailMessageStore': 'vmail1/freshcode.org/',
    'domainName' : 'freshcode',
    'postDomain' : 'org',
    'usernameclient' : 'cn=Manager,dc=freshcode,dc=org',
    'usernamepassword' : 'UIfLqdOIYX2yrSsLPIseWYZKyzzQu8'
};