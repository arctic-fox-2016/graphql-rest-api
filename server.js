import express from 'express'
import bodyParser from 'body-parser'
import schema from './schema.js'
import {graphql} from 'graphql'
import GraphQLHTTP from 'express-graphql'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res, next) => {
  let query = '{users {id name age}}'
  graphql(schema, query).then(result => {
    res.json(result)
  })
})

app.post('/', (req, res, next) => {
  let query = `mutation{add (name:"${req.body.name}", age:${req.body.age}) {id name age}}`
  graphql(schema, query).then(result => {
    res.json(result)
  })
})

app.put('/', (req, res, next) => {
  let query = `mutation{edit (id:"${req.body.id}" ,name:"${req.body.name}", age:${req.body.age}) {id name age}}`
  graphql(schema, query).then(result => {
    res.json(result)
  })
})

app.delete('/', (req, res, next) => {
  let query = `mutation{delete (id:"${req.body.id}") {id name age}}`
  graphql(schema, query).then(result => {
    res.json(result)
  })
})

app.use('/graphql', GraphQLHTTP({
  schema: schema,
  pretty: true,
  graphiql: true
}))

app.listen(3000, (err) => {
  if(err) console.log(err)
  else console.log('Server is running')
})
