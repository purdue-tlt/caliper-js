/**
 *  @copyright ©2013 IMS Global Learning Consortium, Inc.  All Rights Reserved.
 *  @license For license information contact, info@imsglobal.org
 */

var test = require('tape');
var _ = require('lodash-node');
var util = require('util');
var jsonCompare = require('./testUtils');

var Event = require('../src/events/annotationEvent');

// Actor
var Person = require('../src/entities/agent/person');

// Action
var AnnotationActions = require('../src/actions/annotationActions');

// Activity Context
var EPubVolume = require('../src/entities/reading/ePubVolume');
var Frame = require('../src/entities/reading/frame');
var TagAnnotation = require('../src/entities/annotation/tagAnnotation');
var WebPage = require('../src/entities/reading/webPage');

// Learning Context
var CourseOffering = require('../src/entities/lis/courseOffering');
var CourseSection = require('../src/entities/lis/courseSection');
var Group = require('../src/entities/lis/group');
var Membership = require('../src/entities/lis/membership');
var Role = require('../src/entities/lis/role');
var SoftwareApplication = require('../src/entities/agent/softwareApplication');
var Status = require('../src/entities/lis/status');

test('Create TagAnnotation Event and validate attributes', function (t) {

    // Plan for N assertions
    t.plan(1);

    // The Actor for the Caliper Event
    var actor = new Person("https://some-university.edu/user/554433");
    var membership1 = new Membership("https://some-university.edu/membership/001");
    membership1.setMember("https://some-university.edu/user/554433");
    membership1.setOrganization("https://some-university.edu/politicalScience/2015/american-revolution-101");
    membership1.setRoles([Role.LEARNER]);
    membership1.setStatus(Status.ACTIVE);
    membership1.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    var membership2 = new Membership("https://some-university.edu/membership/002");
    membership2.setMember("https://some-university.edu/user/554433");
    membership2.setOrganization("https://some-university.edu/politicalScience/2015/american-revolution-101/section/001");
    membership2.setRoles([Role.LEARNER]);
    membership2.setStatus(Status.ACTIVE);
    membership2.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    var membership3 = new Membership("https://some-university.edu/membership/003");
    membership3.setMember("https://some-university.edu/user/554433");
    membership3.setOrganization("https://some-university.edu/politicalScience/2015/american-revolution-101/section/001/group/001");
    membership3.setRoles([Role.LEARNER]);
    membership3.setStatus(Status.ACTIVE);
    membership3.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    actor.setHasMembership([membership1, membership2, membership3]);
    actor.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    actor.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // The Action for the Caliper Event
    var action = AnnotationActions.TAGGED;

    // The Object being interacted with by the Actor
    var eventObj = new TagAnnotation("https://someEduApp.edu/tags/7654");
    eventObj.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    eventObj.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());
    eventObj.setTags(["to-read", "1765", "shared-with-project-team"]);

    // The Digital Resource that the targetObj (below) belongs to
    var ePub = new EPubVolume("https://github.com/readium/readium-js-viewer/book/34843#epubcfi(/4/3)");
    ePub.setName("The Glorious Cause: The American Revolution, 1763-1789 (Oxford History of the United States)");
    ePub.setVersion("2nd ed.");
    ePub.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    ePub.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // The target object (frame) within the Event Object
    var targetObj = new Frame("https://github.com/readium/readium-js-viewer/book/34843#epubcfi(/4/3/4)");
    targetObj.setName("The Stamp Act Crisis");
    targetObj.setVersion("2nd ed.");
    targetObj.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    targetObj.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());
    targetObj.setIndex(4);
    targetObj.setIsPartOf(ePub);

    // The edApp that is part of the Learning Context
    var edApp = new SoftwareApplication("https://github.com/readium/readium-js-viewer");
    edApp.setName("Readium");
    edApp.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    edApp.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // LIS Course Offering
    var courseOffering = new CourseOffering("https://some-university.edu/politicalScience/2015/american-revolution-101");
    courseOffering.setName("Political Science 101: The American Revolution");
    courseOffering.setCourseNumber("POL101");
    courseOffering.setAcademicSession("Fall-2015");
    courseOffering.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    courseOffering.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // LIS Course Section
    var courseSection = new CourseSection("https://some-university.edu/politicalScience/2014/american-revolution-101");
    courseSection.setName("American Revolution 101");
    courseSection.setCourseNumber("POL101");
    courseSection.setAcademicSession("Fall-2015");
    courseSection.setMembership([membership2]);
    courseSection.setSubOrganizationOf(courseOffering);
    courseSection.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());

    // LIS Group
    var group = new Group("https://some-university.edu/politicalScience/2015/american-revolution-101/section/001/group/001");
    group.setName("Discussion Group 001");
    group.setMembership([membership3]);
    group.setSubOrganizationOf(courseSection);
    group.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    group.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // Asser that key attributes are the same
    var tagAnnotationEvent = new Event();
    tagAnnotationEvent.setActor(actor);
    tagAnnotationEvent.setAction(action);
    tagAnnotationEvent.setObject(eventObj);
    tagAnnotationEvent.setTarget(targetObj);
    tagAnnotationEvent.setEdApp(edApp);
    tagAnnotationEvent.setGroup(group);
    tagAnnotationEvent.setStartedAtTime((new Date("2015-02-15T10:15:00Z")).toISOString());

    console.log("TAGGED_ANNOTATION Annotation Event = " + util.inspect(tagAnnotationEvent));

    // Assert that JSON produced is the same
    jsonCompare('caliperTagAnnotationEvent', tagAnnotationEvent, t);
})
