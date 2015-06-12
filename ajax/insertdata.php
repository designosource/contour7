<?php
	if (isset($_POST)) {
		try {
            $db_server = "localhost";
            $db_user = "root";
            $db_password = "";
            $db_database = "contour";

            $conn = new mysqli($db_server, $db_user, $db_password, $db_database);
            $conn->set_charset("utf8");
            
            $query = "SELECT * FROM locatie_data WHERE person_id='".$conn->real_escape_string($_POST['person_id'])."' AND location_id='".$conn->real_escape_string($_POST['location_id'])."' AND end_time IS NULL;";
            $result = $conn->query($query);
            
            if($result->num_rows === 0) {
                $query = "INSERT INTO locatie_data (location_id, person_id, start_time, end_time) VALUES ('".$conn->real_escape_string($_POST['location_id'])."', '".$conn->real_escape_string($_POST['person_id'])."', '".$conn->real_escape_string($_POST['start_time'])."', NULL);";
                $conn->query($query);
                
                echo json_encode($conn->insert_id);
            }
            
		} catch (Exception $e) {
			$response["feedback"] = $e->getMessage();
		}			
	}
?>