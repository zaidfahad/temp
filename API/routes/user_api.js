var express = require('express');
var router = express.Router();
var winston = require('../config/winston');
var mongoose = require('mongoose');
const Users = require('../models/Users')

router.get('/getUser', async (req,res)=>{
    console.log('Hit get api');
    try{
        var UserList= await Users.find();
        res.status(200).send(UserList.length != 0? UserList:"no Data");
    }catch(e){
        winston.error(e);
        console.log(e);
        res.status(500).send("Error while fetching aks cluster");
    }
});

router.post('/AddUser', async (req,res)=>{
    console.log('Hit POst api');
    var user_data = req.body;
    try{
        await Users.findOneAndUpdate(
            {
                "user_id": user_data.user_id
            },
            {
                $set: user_data
            },
            {
                new: true,
                upsert: true
            });

        res.status(200).send({ "Status": "User added" });
    }catch(e){
        //winston.error(e);
        console.log(e);
        res.status(500).send("Error while fetching aks cluster");
    }
});

module.exports = router;