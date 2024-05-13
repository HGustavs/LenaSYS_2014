<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'deleteCodeExample' => array(
        'expected-output' => '{poopopoo}',
        'query-before-test-1' => "INSERT INTO codeexample (exampleid,cid,uid) VALUES (9997,1885,101);",
        'query-before-test-2' => "INSERT INTO box (boxid,boxtitle,exampleid) VALUES (99,'oldTitle',9997);",
        'query-after-test-1' => "DELETE FROM box WHERE boxid = 99;",
        'query-after-test-2' => "DELETE FROM codeexample WHERE exampleid = 9997;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/codeviewerService/editBoxTitle_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password', 
                'opt' => 'EDITTITLE',
                'exampleid' => '9997', 
                'boxid' => '99',
                'boxtitle' => 'newTitle' 
            )
        ),
        'filter-output' => serialize(
            array(
                'none'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = pretty print (HTML), false = raw JSON
