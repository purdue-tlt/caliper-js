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

var test = require('tape');
var _ = require('lodash');
var util = require('util');
var jsonCompare = require('./testUtils');

var Event = require('../src/events/assessmentItemEvent');

// Actor
var Person = require('../src/entities/agent/person');

// Action
var AssessmentItemActions = require('../src/actions/assessmentItemActions');

// Activity Context
var Assessment = require('../src/entities/assessment/assessment');
var AssessmentItem = require('../src/entities/assessment/assessmentItem');
var Attempt = require('../src/entities/assignable/attempt');
var FillinBlankResponse = require('../src/entities/response/fillinBlankResponse');

// Learning Context
var CourseOffering = require('../src/entities/lis/courseOffering');
var CourseSection = require('../src/entities/lis/courseSection');
var Group = require('../src/entities/lis/group');
var Membership = require ('../src/entities/lis/membership');
var Role = require('../src/entities/lis/role');
var SoftwareApplication = require('../src/entities/agent/softwareApplication');
var Status = require('../src/entities/lis/status');

test('Create Assessment Item COMPLETED Event and validate attributes', function (t) {

    // Plan for N assertions
    t.plan(1);

    // The Actor for the Caliper Event
    var actor = new Person("https://example.edu/user/554433");
    actor.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    actor.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // The Action for the Caliper Event
    var action = AssessmentItemActions.COMPLETED;

    // Parent assessment
    var parent = new Assessment("https://example.edu/politicalScience/2015/american-revolution-101/assessment/001");
    parent.setName("American Revolution - Key Figures Assessment");
    parent.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());
    parent.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    parent.setDatePublished((new Date("2015-08-15T09:30:00.000Z")).toISOString());
    parent.setVersion("1.0");
    parent.setDateToActivate((new Date("2015-08-16T05:00:00.000Z")).toISOString());
    parent.setDateToShow((new Date("2015-08-16T05:00:00.000Z")).toISOString());
    parent.setDateToStartOn((new Date("2015-08-16T05:00:00.000Z")).toISOString());
    parent.setDateToSubmit((new Date("2015-09-28T11:59:59.000Z")).toISOString());
    parent.setMaxAttempts(2);
    parent.setMaxSubmits(2);
    parent.setMaxScore(3.0);

    // The Object being interacted with by the Actor (AssessmentItem)
    var eventObj = new AssessmentItem(parent['@id'] + "/item/001");
    eventObj.setName("Assessment Item 1");
    eventObj.setIsPartOf(parent);
    eventObj.setMaxAttempts(2);
    eventObj.setMaxSubmits(2);
    eventObj.setMaxScore(1.0);
    eventObj.setDateModified(null);
    eventObj.setVersion("1.0");
    eventObj.setIsTimeDependent(false);

    // The target object (frame) within the Event Object
    var target = null;

    // The attempt (property of the generated response)
    var attempt = new Attempt(eventObj['@id'] + "/attempt/789");
    attempt.setActor(actor['@id']);
    attempt.setAssignable(parent['@id']);
    attempt.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    attempt.setCount(1);
    attempt.setStartedAtTime((new Date("2015-09-15T10:15:00Z")).toISOString());

    // The generated response
    var generated = new FillinBlankResponse(eventObj['@id'] + "/response/001");
    generated.setActor(actor['@id']);
    generated.setAssignable(parent['@id']);
    generated.setAttempt(attempt);
    generated.setValues(["2 July 1776"]);
    generated.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    generated.setStartedAtTime((new Date("2015-09-15T10:15:00Z")).toISOString());

    // The edApp that is part of the Learning Context
    var edApp = new SoftwareApplication("https://example.com/super-assessment-tool");
    edApp.setName("Super Assessment Tool");
    edApp.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    edApp.setDateModified(null);

    // LIS Course Offering
    var courseOffering = new CourseOffering("https://example.edu/politicalScience/2015/american-revolution-101");
    courseOffering.setName("Political Science 101: The American Revolution");
    courseOffering.setCourseNumber("POL101");
    courseOffering.setAcademicSession("Fall-2015");
    courseOffering.setSubOrganizationOf(null);
    courseOffering.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    courseOffering.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // LIS Course Section
    var courseSection = new CourseSection(courseOffering['@id'] + "/section/001");
    courseSection.setName("American Revolution 101");
    courseSection.setCourseNumber("POL101");
    courseSection.setAcademicSession("Fall-2015");
    courseSection.setSubOrganizationOf(courseOffering);
    courseSection.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    courseSection.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // LIS Group
    var group = new Group(courseSection['@id'] + "/group/001");
    group.setName("Discussion Group 001");
    group.setSubOrganizationOf(courseSection);
    group.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());

    // The Actor's Membership
    var membership = new Membership(courseOffering['@id'] + "/roster/554433");
    membership.setName("American Revolution 101");
    membership.setDescription("Roster entry");
    membership.setMember(actor['@id']);
    membership.setOrganization(courseSection['@id']);
    membership.setRoles([Role.LEARNER]);
    membership.setStatus(Status.ACTIVE);
    membership.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());

    // Assert that key attributes are the same
    var event = new Event();
    event.setActor(actor);
    event.setAction(action);
    event.setObject(eventObj);
    event.setTarget(target);
    event.setGenerated(generated);
    event.setEventTime((new Date("2015-09-15T10:15:00Z")).toISOString());
    event.setEdApp(edApp);
    event.setGroup(group);
    event.setMembership(membership);

    console.log("Assessment Item Event = " + util.inspect(event));

    // Assert that JSON produced is the same
    jsonCompare('caliperAssessmentItemCompletedEvent', event, t);
});