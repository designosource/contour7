<?php
	if (isset($_POST)) {
		try {
            $db_server = "localhost";
            $db_user = "root";
            $db_password = "";
            $db_database = "contour";

            $conn = new mysqli($db_server, $db_user, $db_password, $db_database);
            $conn->set_charset("utf8");
            
            $query = "UPDATE locatie_data SET end_time='".$conn->real_escape_string($_POST['end_time'])."' WHERE id='".$conn->real_escape_string($_POST['record_id'])."' AND location_id='".$conn->real_escape_string($_POST['location_id'])."';";
            $conn->query($query);
            
		} catch (Exception $e) {
			$response["feedback"] = $e->getMessage();
		}			

		echo json_encode("Success");
	}
?>