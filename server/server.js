const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.set('views',`${__dirname}/templates`);
app.listen(8080, function(){
  console.log("Helloooooo");
})

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.render('index'); 
})
