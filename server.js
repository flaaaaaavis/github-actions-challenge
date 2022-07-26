const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const fs = require('fs')

app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.send('This is the home page!');
});

let database = JSON.parse(fs.readFileSync('database.json', 'utf8'))

app.post('/register', (req, res) => {
    const {user, pass} = req.body

    if(!user) res.status(401).send({message: 'Give a valid username'})

    if ( database.find(data => data.username == user) === undefined) {
        let newUser = {
            username: user,
            password: pass
        }
        database.push(newUser)
        // console.log(database)
        fs.writeFileSync('database.json', JSON.stringify(database))

        res.sendStatus(201)
    } else {
        res.status(403).send({message: 'User already exists'})
    }
})

app.post('/login', (req, res) => {
    const {user, pass} = req.body

    if ( database.find(data => data.username == user) !== undefined) {
        let registered = database.find(data => data.username == user)
        if ( registered.password == pass  ) {
            res.sendStatus(200)
        } else {
            res.status(403).send({message: 'Wrong password'})
        }
        
    } else res.status(401).send({message: 'Register needed'})
})

app.get('/users', (req, res) => {
    res.status(200).send(database)
})

app.listen( PORT, () => console.log(`Server is listening on port ${PORT}`));