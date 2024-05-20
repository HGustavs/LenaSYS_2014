<?php

include_once "../../../../Shared/test.php";
$testsData = array(
    'removeListEntries_ms.php' => array(
        'expected-output' => '{"entries":[{"entryname":"JavaScript-Code:","lid":1,"pos":1,"kind":1,"moment":null,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"JS-TEST template 1","lid":4000,"pos":1,"kind":2,"moment":null,"link":"7000","visible":3,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:36:04"},{"entryname":"JS-TEST template 2","lid":4001,"pos":1,"kind":2,"moment":null,"link":"7001","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"JS-TEST template 3","lid":4002,"pos":1,"kind":2,"moment":null,"link":"7002","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"JS-TEST template 4","lid":4003,"pos":1,"kind":2,"moment":null,"link":"7003","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"JS-TEST template 5","lid":4004,"pos":1,"kind":2,"moment":null,"link":"7004","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"JS-TEST template 6","lid":4005,"pos":1,"kind":2,"moment":null,"link":"7005","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"JS-TEST template 7","lid":4006,"pos":1,"kind":2,"moment":null,"link":"7006","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"JS-TEST template 8","lid":4007,"pos":1,"kind":2,"moment":null,"link":"7007","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"JS-TEST template 9","lid":4008,"pos":1,"kind":2,"moment":null,"link":"7008","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"JS-TEST template 10","lid":4009,"pos":1,"kind":2,"moment":null,"link":"7009","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"HTML-Code:","lid":2,"pos":2,"kind":1,"moment":null,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"Html-test template 1","lid":5000,"pos":2,"kind":2,"moment":null,"link":"6000","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"Html-test template 2","lid":5001,"pos":2,"kind":2,"moment":null,"link":"6001","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"Html-test template 3","lid":5002,"pos":2,"kind":2,"moment":null,"link":"6002","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"Html-test template 4","lid":5003,"pos":2,"kind":2,"moment":null,"link":"6003","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"Html-test template 5","lid":5004,"pos":2,"kind":2,"moment":null,"link":"6004","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"Html-test template 6","lid":5005,"pos":2,"kind":2,"moment":null,"link":"6005","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"Html-test template 7","lid":5006,"pos":2,"kind":2,"moment":null,"link":"6006","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"Html-test template 8","lid":5007,"pos":2,"kind":2,"moment":null,"link":"6007","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"Html-test template 9","lid":5008,"pos":2,"kind":2,"moment":null,"link":"6008","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"Html-test template 10","lid":5009,"pos":2,"kind":2,"moment":null,"link":"6009","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"SQL-CODE:","lid":4,"pos":3,"kind":1,"moment":null,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"SQL-TEST template 1","lid":3110,"pos":3,"kind":2,"moment":null,"link":"8000","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"SQL-TEST template 2","lid":3111,"pos":3,"kind":2,"moment":null,"link":"8001","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"SQL-TEST template 3","lid":3112,"pos":3,"kind":2,"moment":null,"link":"8002","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"SQL-TEST template 4","lid":3113,"pos":3,"kind":2,"moment":null,"link":"8003","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"SQL-TEST template 5","lid":3114,"pos":3,"kind":2,"moment":null,"link":"8004","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"SQL-TEST template 6","lid":3115,"pos":3,"kind":2,"moment":null,"link":"8005","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"SQL-TEST template 7","lid":3116,"pos":3,"kind":2,"moment":null,"link":"8006","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"SQL-TEST template 8","lid":3117,"pos":3,"kind":2,"moment":null,"link":"8007","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"SQL-TEST template 9","lid":3118,"pos":3,"kind":2,"moment":null,"link":"8008","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"SQL-TEST template 10","lid":3119,"pos":3,"kind":2,"moment":null,"link":"8009","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"PHP-CODE:","lid":5,"pos":4,"kind":1,"moment":null,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"PHP-TEST template 1","lid":2110,"pos":4,"kind":2,"moment":null,"link":"9000","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"PHP-TEST template 2","lid":2111,"pos":4,"kind":2,"moment":null,"link":"9001","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"PHP-TEST template 3","lid":2112,"pos":4,"kind":2,"moment":null,"link":"9002","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"PHP-TEST template 4","lid":2113,"pos":4,"kind":2,"moment":null,"link":"9003","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"PHP-TEST template 5","lid":2114,"pos":4,"kind":2,"moment":null,"link":"9004","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"PHP-TEST template 6","lid":2115,"pos":4,"kind":2,"moment":null,"link":"9005","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"PHP-TEST template 7","lid":2116,"pos":4,"kind":2,"moment":null,"link":"9006","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"PHP-TEST template 8","lid":2117,"pos":4,"kind":2,"moment":null,"link":"9007","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"PHP-TEST template 9","lid":2118,"pos":4,"kind":2,"moment":null,"link":"9008","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"PHP-TEST template 10","lid":2119,"pos":4,"kind":2,"moment":null,"link":"9009","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":null,"relativedeadline":null,"qrelease":null,"comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"},{"entryname":"Other:","lid":6,"pos":5,"kind":1,"moment":null,"link":"1","visible":1,"highscoremode":0,"gradesys":null,"code_id":null,"deadline":"2015-01-30 15:30:00","relativedeadline":null,"qrelease":"2015-01-01 00:00:00","comments":null,"qstart":null,"grptype":null,"tabs":null,"feedbackenabled":0,"feedbackquestion":null,"ts":"2024-05-17 13:29:05"}],"debug":"NONE!","coursename":"Testing-Course","coursevers":"1337","coursecode":"G1337","courseid":"1885"}',
        'query-before-test-1' => "INSERT INTO listentries (lid, vers, entryname, creator, cid, kind, visible) VALUES (4294967295, 97732, 'TestMoment', 101, 1885, 3, 1);",
        'query-after-test-1' => "DELETE FROM listentries WHERE lid = 4294967295;", 
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/removeListEntries_ms.php',
        'service-data' => serialize(
            array( 
                // Data that service needs to execute function
                'opt' => 'DELETE',
                'lid' => '4294967295',
                'courseid' => 1885,
                'coursevers' => 1337,
                'comment' => 'undefined',
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array( 
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries',
                'debug',
                'coursename',
                'coursevers',
                'coursecode',
                'courseid',
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>