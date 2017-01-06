/*
 * This file is part of IMS Caliper Analytics™ and is licensed to
 * IMS Global Learning Consortium, Inc. (http://www.imsglobal.org)
 * under one or more contributor license agreements.  See the NOTICE
 * file distributed with this work for additional information.
 *
 * IMS Caliper is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * IMS Caliper is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with this program. If not, see http://www.gnu.org/licenses/.
 */

var _ = require('lodash-node');
var http = require('https');
var Q = require('q');
var logger = require('../logger');
var moment = require('moment');
var requestor = require('./eventStoreRequestor');

/**
 * Represents httpRequestor self.
 * @constructor httpRequestor
 */
var self = this;
var options = {};

/*
 * Check if self is properly initialized
 */
var initialized = function() {
    return true; //TODO
};

/**
 * Initializes the default self to use.
 * @function initialize
 * @param options $options passed straight to the self
 */
self.initialize = function(sensorOptions) {
    if (!_.isUndefined(sensorOptions)) {
        options = sensorOptions;
    }
    requestor.initialize(sensorOptions);
    logger.log('debug', "Initialized httpRequestor with options " + JSON.stringify(options));
};

/**
 * Create envelope.
 * @param sensor
 * @param data
 */
self.createEnvelope = function(sensor, data) {
    return requestor.createEnvelope(sensor, data);
};

/**
 * Retrieve payload.
 * @param sensor
 * @param data
 * @returns payload
 */
self.getJsonPayload = function(sensor, data) {
    return requestor.getJsonPayload(sensor, data);
};

/**
 * Send Caliper data.
 * @param sensor
 * @param data
 */
self.send = function(sensor, data) {
    return Q.Promise(function(resolve, reject, notify) {
        if (!initialized()) {
            reject(new Error('httpRequestor not initialized'));
            return;
        }

        logger.log('debug', 'Sending data ' + JSON.stringify(data));

        // Create the Envelope payload
        var jsonPayload = requestor.getJsonPayload(sensor, data);

        logger.log('debug', 'Added data to envelope ' + JSON.stringify(jsonPayload));

        // Add Headers
        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': jsonPayload.length
        };

        // Merge headers
        var sendOptions = _.merge(options, {method: 'POST'}, {headers: headers});

        logger.log('debug', 'httpRequestor: about to request using sendOptions = ' + JSON.stringify(sendOptions));

        // Create request
        var request = http.request(sendOptions, (response) => {
            logger.log('info', "request complete. reading response = " + JSON.stringify(response));
            // ignore response for failed request, handled in .on('error') below
            if (response.statusCode === 0) {
            	return;
            }

            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', () => {
                logger.log('info', 'response body received');
                // match 200 level status codes
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    var parsedBody = body.length > 0 ? JSON.parse(body) : body;
                    resolve(parsedBody);
                } else {
                    var error = new Error('response error = ' + body);
                    logger.log('error', error);
                    reject(error);
                }
            });
        });

        request.on('error', (error) => {
            logger.log('error', 'send error = ' + error);
            reject(error);
        });

        // Write request
        request.write(jsonPayload);
        request.end();
    });
};

module.exports = {
    initialize: self.initialize,
    createEnvelope: self.createEnvelope,
    getJsonPayload: self.getJsonPayload,
    send: self.send
};
