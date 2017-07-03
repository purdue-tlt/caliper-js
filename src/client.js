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
var requestor = require('./request/httpRequestor');
var logger = require('./logger').get('client');

/**
 * Represents asynchronous self for the Caliper Sensor.
 * @constructor client
 */
var self = this;
var options = {};

/**
 * Initializes the default self to use.
 * @memberof client
 * @function initialize
 * @param options $options passed straight to the self
 */
self.initialize = function(sensorOptions) {
    options = sensorOptions;
    requestor.initialize(sensorOptions);
    logger.info("Initialized Client with options " + JSON.stringify(options));
};

/**
 * Describe an entity or entities
 * @memberof client
 * @function describe
 * @param sensor
 * @param entity
 */
self.describe = function(sensor, entity) {
    return requestor.send(sensor, entity);
};

/**
 * Send learning events
 * @memberof client
 * @function send
 * @param sensor
 * @param event
 */
self.send = function(sensor, event) {
    return requestor.send(sensor, event);
};

module.exports = {
    initialize: self.initialize,
    send: self.send,
    describe: self.describe
};
