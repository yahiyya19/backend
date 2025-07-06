const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb+srv://Yahiyya_19:Yahiyya_19@cluster0.ht3jq0c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', (err, db) => {
  if (err) throw err

  db.collection('mammals').find().toArray((err, result) => {
    if (err) throw err

    console.log(result)
  })
})
