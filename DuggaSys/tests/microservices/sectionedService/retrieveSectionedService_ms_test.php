<?php

include_once "../../../../Shared/test.php";

$testsData = array(

    // Test 1 Retrieve information

    'retrieveSectionedService_ms' => array(
        'expected-output' => '{"entries":[{"lid":1,"tabs":1},{"lid":4000,"tabs":null},{"lid":4001,"tabs":null},{"lid":4002,"tabs":null},{"lid":4003,"tabs":null},{"lid":4004,"tabs":null},{"lid":4005,"tabs":null},{"lid":4006,"tabs":null},{"lid":4007,"tabs":null},{"lid":4008,"tabs":null},{"lid":4009,"tabs":null},{"lid":2,"tabs":null},{"lid":5000,"tabs":null},{"lid":5001,"tabs":null},{"lid":5002,"tabs":null},{"lid":5003,"tabs":null},{"lid":5004,"tabs":null},{"lid":5005,"tabs":null},{"lid":5006,"tabs":null},{"lid":5007,"tabs":null},{"lid":5008,"tabs":null},{"lid":5009,"tabs":null},{"lid":4,"tabs":null},{"lid":3110,"tabs":null},{"lid":3111,"tabs":null},{"lid":3112,"tabs":null},{"lid":3113,"tabs":null},{"lid":3114,"tabs":null},{"lid":3115,"tabs":null},{"lid":3116,"tabs":null},{"lid":3117,"tabs":null},{"lid":3118,"tabs":null},{"lid":3119,"tabs":null},{"lid":5,"tabs":null},{"lid":2110,"tabs":null},{"lid":2111,"tabs":null},{"lid":2112,"tabs":null},{"lid":2113,"tabs":null},{"lid":2114,"tabs":null},{"lid":2115,"tabs":null},{"lid":2116,"tabs":null},{"lid":2117,"tabs":null},{"lid":2118,"tabs":null},{"lid":2119,"tabs":null},{"lid":6,"tabs":null}],"debug":"NONE!"}',
        'query-before-test-1' => 'UPDATE course SET activeversion=NULL WHERE cid=1885;',
        'query-after-test-1' => "UPDATE listentries SET tabs = null WHERE cid = 1885 AND lid = 1;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/retrieveSectionedService_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'username' => 'brom',
                'password' => 'password',
                'cid' => '1885',
                'versid' => '123',
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'entries',
                    'debug',
                    'writeaccess',
                    'studentteacher',
                    'readaccess',
                    'coursename',
                    'coursevers',
                    'coursecode',
                    'courseid',
                    'links',
                    'duggor',
                    'results',
                    'versions',
                    'codeexamples',
                    'unmarked',
                    'startdate',
                    'enddate',
                    'groups',
                    'grpmembershp',
                    'grplst',
                    'userfeedback',
                    'feedbackquestion', 
                    'avgfeedbackscore' 
                ),
                'debug'
            )
        ),
    )

);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON