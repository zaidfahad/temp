var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var winston = require('./config/winston')
var dotenv = require('dotenv');
var userRout = require('./routes/user_api')
var WorkItemRoute = require('./routes/Virtual_Environment_Workspace');
var sample = require('./routes/simple');
var teamAnggment = require('./routes/team_engagement');
var wordCloud = require('./routes/wordcloud');
//var authRouther=require('./AuthToken');
var MiroBoard=require('./routes/Miro/Board')
var MsTeams=require('./routes/MSGraph/MicrosoftTeam/Teams')
var MSGraphInstall=require('./routes/MSGraph/MicrosoftTeam/Installation')
var cors = require('cors');
const request = require('request-promise');
const router = require('./routes/Miro/Board');
var Kahoot=require('./routes/Kahoot/Kahoot')
//var MSGraphChannels=require('./routes/MSGraph/Channels')
dotenv.config();
require('./db/db');

var port = process.env['PORT'];

console.log("Server run at "+ port)
app.use(cors())
//app.use(express.json())
// parse application/json // get all data/stuff of the body (POST) parameters
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api',userRout);

app.use('/api',WorkItemRoute);
app.use('/api',sample);

app.use('/api',teamAnggment);

app.use('/api',wordCloud);
//app.use('/auth',authRouther);

app.use('/api/miro',MiroBoard);

app.use('/api',MsTeams);
app.use('/api/',MSGraphInstall);
app.use('/api/kahoot',Kahoot);
//app.use('/api',MSGraphChannels);
//404 Error handling
app.use((req, res, next) => {
    //console.log("hit 404 error");
    winston.error("404 - NOT FOUND -" + `${req.originalUrl} - ${req.method} - ${req.ip}`);
    console.log("404 - NOT FOUND -" + `${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(404).send("Sorry can't find that!");
});

//500 Error handling
app.use((err, req, res, next) => {
    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    console.log(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(500).send('Something broke!');
});

app.listen(port,() => {
    winston.info("Server started on port",port);
    console.log("Server started on port",port);
});
