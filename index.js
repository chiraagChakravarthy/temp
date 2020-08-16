const express = require('express');
const app = express();
const sha256 = require('js-sha256');
const now = require('nano-time');
const fs = require('fs')


app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.post('/register', (req, res) => {
    var body = req.body;
    var salt = now();//nanotime
    var account = {
        "linkedin": body.linkedin,
        "birthday": body.birthday,
        "specialty": body.specialty,
        "password": {
            "salt": salt,
            "hash": sha256(body.password + salt)
        }
    }
    var usersString = readUsers()

    var users = JSON.parse(usersString);
    if(users.hasOwnProperty(body.name)){
        res.send('1')
    } else {
        users[body.name] = account;
        writeUsers(JSON.stringify(users))
        res.send('0')
    }
    
})

app.get('/users', (req, res) => {
    res.write(fs.readFileSync('users.json'))
    res.end();
})

app.post('/login', (req, res) => {
    var body = req.body;
    var users = JSON.parse(readUsers());

    if(users.hasOwnProperty(body.name)){
        var password = users[body.name]['password'];
        if(sha256(body.password + password.salt)==password.hash){
            res.send('0')
            console.log('0')
        } else {
            res.send('2')
            console.log('2')
        }
    } else {
        res.send('1')
        console.log('1')
    }
    res.end()
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('listening on port ' + PORT));

app.get('/user', (req, res) => {
    var query = req.query;
    var users = JSON.parse(readUsers())
    console.log(query.name)
    if(users.hasOwnProperty(query.name)){
        var user = users[query.name]
        res.write(JSON.stringify({
            'name': query.name,
            'birthday': user.birthday,
            'specialty': user.specialty,
            'linkedin': user.linkedin
        }))
    } else {
        res.write("1")
    }
    res.end()
})

function readUsers(){
    var users = fs.readFileSync('users.json');
    return users;
}

function writeUsers(users){
    fs.writeFileSync('users.json', users)
}