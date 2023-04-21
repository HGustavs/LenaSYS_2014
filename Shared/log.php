<?php
/********************************************************************************

   Documentation 
   
*********************************************************************************

 Presents the data housed in the loglena database tables, in a readable fashion.

-------------==============######## Documentation End ###########==============-------------
*/?>

<html>
<head>
    <style>
        table, th, td {
        border:1px solid black;
        border-collapse: collapse;
    }
    #set_to_default_button{
        display: block;
        margin-top: 2vh;
        margin-bottom: 2vh;
    }
    th{
        background-color: #614875;
    }
    th a{
        color: white;
        text-decoration: none;
    }
    table tr:nth-child(even){
        background-color: #f2f2f2;
    }

    table tr:hover {
        background-color: #ddd;
    }
    </style>
</head>
    <body>
        <?php
            try {
	            $log_db = new PDO('sqlite:../../log/loglena6.db');
            } catch (PDOException $e) {
	            echo "Failed to connect to the database";
	            throw $e;
            }
        ?>
        
        <!----------------------------------------------------------------------------------->  
        <!------Creates a dropdown with all tables in the loglena database------------------->
        <!----------------------------------------------------------------------------------->
        <span><form id="form1" name="form1" method="post" action="<?php echo $PHP_SELF; ?>">
        <?php    
            date_default_timezone_set('Etc/GMT+2'); //Used in serviceLogEntries to convert unix to datetime

            echo 'Choose table: ';
            echo '<select onchange="this.form.submit()" name="name" >';
                foreach($log_db->query( 'SELECT name FROM sqlite_master;' ) as $row){
                    echo '<option value="'.$row['name'].'"';
                        if(isset($_POST['name'])){
                            if($_POST['name']==$row['name']) echo " selected ";
                        }
                    echo '>'.$row['name'].'</option>';
                    echo"<p>".$row['name']."</p>";
                }
            echo '</select>';

//---------------------------------------------------------------------------------------------------
// Present data  <-- Presents the information from each db table 
//---------------------------------------------------------------------------------------------------

            // Set to default button
            echo "<a href='log.php?order=timestamp&&sort=DESC' id='set_to_default_button'>Set to default(timestamp, descending order)</a>";
            
            // Code used to sort tables.
            // Default values are time in descending order.
            if(isset($_GET['order'])){
                $order = $_GET['order'];
            }
            else{
                $order = 'timestamp';
            }
            if(isset($_GET['sort'])){
                $sort = $_GET['sort'];
            }
            else{
                $sort = 'DESC';
            }
            
            // Gathers information from database table logEntries
            if((isset($_POST['name'])) && ($_POST['name']=='logEntries')){
                $order = isset($_GET['order']) ? $_GET['order'] : 'id';
                $sort = isset($_GET['sort']) && $_GET['sort'] == 'DESC' ? 'ASC' : 'DESC';
                $columns = array('id', 'eventype', 'description', 'userAgent', 'timestamp');

                if (!in_array($order, $columns)) {
                    $order = 'id';
                }

                $logEntriesSql = $log_db->query('SELECT * FROM logEntries ORDER BY '.$order.' '.$sort.';');
                $logEntriesResults = $logEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?order=eventype&&sort=$sort'>eventype</a></th>
                        <th><a href='log.php?order=description&&sort=$sort'>description</a></th>
                        <th><a href='log.php?order=userAgent&&sort=$sort'>userAgent</a></th>
                        <th><a href='log.php?order=timestamp&&sort=$sort'>timestamp</a></th>
                    </tr>
                ";
                foreach($logEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        echo"
                            <td>".$row."</td>
                        ";
                    }
                    echo"</tr>";
                }
                echo"
                </table>
                ";
            }
            
            // Gathers information from database table exampleLoadLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='exampleLoadLogEntries')){
                $order = isset($_GET['order']) ? $_GET['order'] : 'id';
                $sort = isset($_GET['sort']) && $_GET['sort'] == 'DESC' ? 'ASC' : 'DESC';
                $columns = array('id', 'type', 'courseid', 'uid', 'username', 'exampleid', 'timestamp');

                if (!in_array($order, $columns)) {
                    $order = 'id';
                }
                $exampleLoadLogEntriesSql = $log_db->query('SELECT * FROM exampleLoadLogEntries ORDER BY '.$order.' '.$sort.';');
                $exampleLoadLogEntriesResults = $exampleLoadLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?order=type&&sort=$sort'>type</a></th>
                        <th><a href='log.php?order=courseid&&sort=$sort'>courseid</a></th>
                        <th><a href='log.php?order=uid&&sort=$sort'>uid</a></th>
                        <th><a href='log.php?order=username&&sort=$sort'>username</a></th>
                        <th><a href='log.php?order=exampleid&&sort=$sort'>exampleid</a></th>
                        <th><a href='log.php?order=timestamp&&sort=$sort'>timestamp</a></th>
                    </tr>
                ";
                foreach($exampleLoadLogEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        echo"
                            <td>".$row."</td>
                        ";
                    }
                    echo"</tr>";
                }
                echo"
                </table>
                ";
            }

            // Gathers information from database table userHistory
            if((isset($_POST['name'])) && ($_POST['name']=='userHistory')){
                $order = isset($_GET['order']) ? $_GET['order'] : 'id';
                $sort = isset($_GET['sort']) && $_GET['sort'] == 'DESC' ? 'ASC' : 'DESC';
                $columns = array('refer', 'userid', 'username', 'IP', 'URLParams', 'timestamp');

                if (!in_array($order, $columns)) {
                    $order = 'id';
                }
                $userHistorySql = $log_db->query('SELECT * FROM userHistory ORDER BY '.$order.' '.$sort.';');
                $userHistoryResults = $userHistorySql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?order=refer&&sort=$sort'>refer</a></th>
                        <th><a href='log.php?order=userid&&sort=$sort'>userid</a></th>
                        <th><a href='log.php?order=username&&sort=$sort'>username</a></th>
                        <th><a href='log.php?order=IP&&sort=$sort'>IP</a></th>
                        <th><a href='log.php?order=URLParams&&sort=$sort'>URLParams</a></th>
                        <th><a href='log.php?order=timestamp&&sort=$sort'>timestamp</a></th>
                    </tr>
                ";
                foreach($userHistoryResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        echo"
                            <td>".$row."</td>
                        ";
                    }
                    echo"</tr>";
                }
                echo"
                </table>
                ";
            }

            // Gathers information from database table userLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='userLogEntries')){
                
                $order = isset($_GET['order']) ? $_GET['order'] : 'id';
                $sort = isset($_GET['sort']) && $_GET['sort'] == 'DESC' ? 'ASC' : 'DESC';
                $columns = array('id', 'uid', 'username', 'eventType', 'description', 'timestamp', 'userAgent', 'remoteAddress');
                if (!in_array($order, $columns)) {
                    $order = 'id';
                }
                $userLogEntriesSql = $log_db->query('SELECT * FROM userLogEntries ORDER BY '.$order.' '.$sort.';');
                $userLogEntriesResults = $userLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?order=uid&&sort=$sort'>uid</a></th>
                        <th><a href='log.php?order=username&&sort=$sort'>username</a></th>
                        <th><a href='log.php?order=eventType&&sort=$sort'>eventType</a></th>
                        <th><a href='log.php?order=description&&sort=$sort'>description</a></th>
                        <th><a href='log.php?order=timestamp&&sort=$sort'>timestamp</a></th>
                        <th><a href='log.php?order=userAgent&&sort=$sort'>userAgent</a></th>
                        <th><a href='log.php?order=remoteAddress&&sort=$sort'>remoteAddress</a></th>
                    </tr>
                ";
                foreach($userLogEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        echo"
                            <td>".$row."</td>
                        ";
                    }
                    echo"</tr>";
                }
                echo"
                </table>
                ";
            }

            // Gathers information from database table serviceLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='serviceLogEntries')){

                $order = isset($_GET['order']) ? $_GET['order'] : 'id';
                $sort = isset($_GET['sort']) && $_GET['sort'] == 'DESC' ? 'ASC' : 'DESC';
                $columns = array('id', 'uuid', 'eventType', 'service', 'userid', 'timestamp', 'userAgent', 'operatingSystem', 'info', 'referer', 'IP', 'browser');
                if (!in_array($order, $columns)) {
                    $order = 'id';
                }

                $serviceLogEntriesSql = $log_db->query('SELECT * FROM serviceLogEntries ORDER BY '.$order.' '.$sort.';');
                $serviceLogEntriesResults = $serviceLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?order=uuid&&sort=$sort'>uuid</a></th>
                        <th><a href='log.php?order=eventType&&sort=$sort'>eventType</a></th>
                        <th><a href='log.php?order=service&&sort=$sort'>service</a></th>
                        <th><a href='log.php?order=userid&&sort=$sort'>userid</a></th>
                        <th><a href='log.php?order=timestamp&&sort=$sort'>timestamp</a></th>
                        <th><a href='log.php?order=userAgent&&sort=$sort'>userAgent</a></th>
                        <th><a href='log.php?order=operatingSystem&&sort=$sort'>operatingSystem</a></th>
                        <th><a href='log.php?order=info&&sort=$sort'>info</a></th>
                        <th><a href='log.php?order=referer&&sort=$sort'>referer</a></th>
                        <th><a href='log.php?order=IP&&sort=$sort'>IP</a></th>
                        <th><a href='log.php?order=browser&&sort=$sort'>browser</a></th>
                    </tr>
                ";
                foreach($serviceLogEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        echo"
                            <td>".$row."</td>
                        ";
                    }
                    echo"</tr>";
                }
                echo"
                </table>
                ";
            }

            // Gathers information from database table duggaLoadLogEntries
            if((isset($_POST['name'])) && ($_POST['name']=='duggaLoadLogEntries')){

                $order = isset($_GET['order']) ? $_GET['order'] : 'id';
                $sort = isset($_GET['sort']) && $_GET['sort'] == 'DESC' ? 'ASC' : 'DESC';
                $columns = array('id', 'type', 'cid', 'uid', 'username', 'vers', 'quizid', 'timestamp');
                if (!in_array($order, $columns)) {
                    $order = 'id';
                }

                $duggaLoadLogEntriesSql = $log_db->query('SELECT * FROM duggaLoadLogEntries ORDER BY '.$order.' '.$sort.';');
                $duggaLoadLogEntriesResults = $duggaLoadLogEntriesSql->fetchAll(PDO::FETCH_ASSOC);
                echo"
                <table border='1'>
                    <tr>
                        <th><a href='log.php?order=id&&sort=$sort'>id</a></th>
                        <th><a href='log.php?order=type&&sort=$sort'>type</a></th>
                        <th><a href='log.php?order=cid&&sort=$sort'>cid</a></th>
                        <th><a href='log.php?order=uid&&sort=$sort'>uid</a></th>
                        <th><a href='log.php?order=username&&sort=$sort'>username</a></th>
                        <th><a href='log.php?order=vers&&sort=$sort'>vers</a></th>
                        <th><a href='log.php?order=quizid&&sort=$sort'>quizid</a></th>
                        <th><a href='log.php?order=timestamp&&sort=$sort'>timestamp</a></th>
                    </tr>
                ";
                foreach($duggaLoadLogEntriesResults as $rows) {
                    echo"<tr>";
                    foreach($rows as $row) {
                        echo"
                            <td>".$row."</td>
                        ";
                    }
                    echo"</tr>";
                }
                echo"
                </table>
                ";
            }
        ?>    
    </body>
</html>