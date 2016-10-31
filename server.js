'user strict'
var path = require('path')
var express = require('express')
var app = express()
import schema  from './schema2'
import {graphql} from 'graphql'
// import GraphiQL from 'graphiql'
import graphQLHTTP from 'express-graphql'
var port = 4000
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/',express.static(path.join(__dirname,'public')))
app.get('/api/users', (req,res)=>{
  let query = '{users {name age}}'
  graphql(schema,query).then(result => {
    res.json(result)
  } )
})

app.post('/api/users', (req,res)=>{
  let query = `mutation{insert(name: "${req.body.name}", age: ${req.body.age}){id name age}}`
  graphql(schema,query).then(result => {
    res.json(result)
  })
})

app.put('/api/users/:id', (req,res)=>{
  let query = `mutation{update(id : "${req.params.id}", name: "${req.body.name}", age: ${req.body.age}){id name age}}`
  graphql(schema,query).then(result => {
    res.json(result)
  })
})

app.delete('/api/users/:id', (req,res)=>{
  let query = `mutation{delete(id : "${req.params.id}"){id name age}}`
  graphql(schema,query).then(result => {
    res.json(result)
  })
})

app.use('/graphql',graphQLHTTP({
  schema: schema,
  pretty: true,
  graphiql: true
}))
app.listen(port,function (err) {
  if(err){
    console.log(err)
  } else{
    console.log('serving on port ',port)
  }
})
