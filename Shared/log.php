<html>
<head>
    <style>
        table, th, td {
        border:1px solid black;
    }
    </style>    
</head>
    <body>
        <?php
        
            function debug($o){
                echo '<pre>';
                print_r($o);
                echo '</pre>';
            }

            
              
            try {
	            $log_db = new PDO('sqlite:../../log/loglena6.db');
            } catch (PDOException $e) {
	            echo "Failed to connect to the database";
	            throw $e;
            }
            // $log_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
            // $log_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);           // en del av error hanteringen.

    
            
            echo "<table style='width:100%'>";
                foreach($log_db->query('SELECT * FROM serviceLogEntries;') as $row) {
                    echo '<tr>';
                        echo '<td>'.$row["id"].'</td>';
                        echo '<td>'.$row["uuid"].'</td>';
                        echo '<td>'.$row["eventType"].'</td>';
                        echo '<td>'.$row["service"].'</td>';
                        echo '<td>'.$row["userid"].'</td>';
                        echo '<td>'.$row["timestamp"].'</td>';
                        echo '<td>'.$row["userAgent"].'</td>';
                        echo '<td>'.$row["operatingSystem"].'</td>';
                        echo '<td>'.$row["info"].'</td>';
                        echo '<td>'.$row["referer"].'</td>';
                        echo '<td>'.$row["IP"].'</td>';
                        echo '<td>'.$row["browser"].'</td>';
                    echo '</tr>';

                    
                    // echo "<th>".$column['uuid']."</th>";
                    // echo "<th>".$column['service']."</th>";
                    // echo "<script> console.log(".$column['Field']."); </script>"; 
                    // debug($column);
                }  
            echo "</table>";
            
            
            // echo "<table style='width:100%'>";
            //     foreach($log_db->query('SELECT * FROM serviceLogEntries;') as $row) {
            //         echo "BALALA";
            //         echo "<th>".$row['uuid']."</th>";
            //         echo "<script> console.log(".$row['uuid']."); </script>";
            //         printf("EFTER".$row['Field']); 

            //     }  
            // echo "</table>";
            


            $url = "https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/Shared/latestlog.json";
            $jsontext = file_get_contents($url);
            $arr = json_decode($jsontext, true);
            
            
            // echo "<table style='width:100%'>";
            //     echo "<tr>";
            //         echo "<th> Options </th>";
            //         echo "<th> Parameters </th>";
            //         echo "<th> Kind of Page </th>";
            //         echo "<th> Parameter type </th>";
            //         echo "<th> Date </th>";
              
            //     echo "<tr>";
            //         // Arrays of arrays can be traversed using a nested foreach
            //         foreach ($arr as $key => $value) {
            //             echo $value."</br>";
            //             foreach ($value as $valuekey => $valuevalue) {
            //             echo "<td>".$valuekey.": ".$valuevalue."</td></br>";
            //             }
            //         }
            //         echo "<br>";
            //         echo "</tr>";

            
            //     echo "</tr>";
            // echo "</table>";

        ?>    
    </body>

</html>