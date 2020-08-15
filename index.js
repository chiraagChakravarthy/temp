const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser);

app.post('/register', (req, res) => {
    console.log(req.body.name);
    console.log('test');
    res.send('Hello There');
})

app.listen(8080, () => console.log('listening on port 8080'));