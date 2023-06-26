const express = require('express');
const { createServer } = require('http');
const realtimeServer = require('./realtimeServer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

httpServer.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

io = realtimeServer(httpServer);