'use strict';

require('dotenv').config();

const request = require('request');
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
var params = {
    Filters: [
        {
            Name: 'event.code',
            Values: [
                'instance-retirement'
                /* more items */
            ]
        }
    ]
};

module.exports.notify = function(event, context, cb) {

	var completeWebhook =  process.env.SLACK.concat( process.env.WEBHOOK );

    ec2.describeInstanceStatus(params, function(err, data) {
        var message = '';
        if (err) {
            console.log("Error", err.stack);
            message = err.stack
        } else if(!data.InstanceStatuses.length) {
            message = "There are no instances to be retired";
        } else {
            console.log("Success", JSON.stringify(data));
            data.InstanceStatuses.forEach(function (instance) {
                message=message+' ,'+instance.InstanceId;
            })
            message = "Following Instances will be retired "+message;
        }

        request.post( completeWebhook, {
                form: {
                    payload: '{"text": "Now is: '+ new Date() +message+'"}'
                } },
            function (err, response, body)  {
                if (! err) {
                    return cb(null, { message: 'Slack message sent' })
                } else {
                    return cb(true, err);
                }
            }
        );

        const response = {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*",'Access-Control-Allow-Credentials':"true" },
            body: JSON.stringify(message)
        };
        cb(null, response);
    });


};