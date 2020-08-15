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
        "speciality": body.speciality,
        "password": {
            "salt": salt,
            "hash": sha256(body.password + salt)
        }
    }
    var usersString = readUsers()

    var users = JSON.parse(usersString);
    console.log(users)
    console.log(account)
    users[body.name] = account;
    writeUsers(JSON.stringify(users))
    res.send('Ok');
})

app.get('/users', (req, res) => {
    console.log('got')
    res.write(fs.readFileSync('users.json'))
    res.end();
})

app.post('/register1', (req, res)=>{

})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('listening on port ' + PORT));



function readUsers(){
    var users = fs.readFileSync('users.json');
    return users;
}

function writeUsers(users){
    fs.writeFileSync('users.json', users)
}