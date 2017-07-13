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

var _ = require('lodash');
var request = require('superagent');
var Promise = require('bluebird');
var logger = require('../logger').get('httpRequestor');
var moment = require('moment');
var StandardHttpError = require('standard-http-error');
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
    logger.debug("Initialized httpRequestor with options " + JSON.stringify(options));
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
    return new Promise(function(resolve, reject) {
        if (!initialized()) {
            reject(new Error('httpRequestor not initialized'));
            return;
        }

        logger.debug('Sending data ' + JSON.stringify(data));

        // Create the Envelope payload
        var jsonPayload = requestor.getJsonPayload(sensor, data);

        logger.debug('Added data to envelope ' + JSON.stringify(jsonPayload));

        // Add Headers
        var headers = {
            'Content-Type': 'application/json; charset=utf-8'
        };

        // Merge headers
        var sendOptions = _.merge(options, {headers: headers});

        logger.debug('httpRequestor: about to request using sendOptions = ' + JSON.stringify(sendOptions));
        request
            .post(sendOptions.protocol + sendOptions.hostname + sendOptions.path)
            .set(sendOptions.headers)
            .send(jsonPayload)
            .end(function(err, res) {
                logger.info('response body received');
                if (res && res.status >= 200 && res.status < 300) {
                    var body = res.text ? res.text : '';
                    var parsedBody = body.length > 0 ? JSON.parse(body) : body;
                    resolve(parsedBody);
                    return;
                }

                //http errors
                if (err && (typeof err.status === 'number')) {
                    var error = new StandardHttpError(err.status, {data: err.response.text});
                    logger.error(error);
                    reject(error);
                    return;
                }

                logger.error('send error = ' + error);
                reject(err);
        });
    });
};

module.exports = {
    initialize: self.initialize,
    createEnvelope: self.createEnvelope,
    getJsonPayload: self.getJsonPayload,
    send: self.send
};
