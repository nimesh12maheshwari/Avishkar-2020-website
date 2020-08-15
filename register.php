<?php

require('function.php');

$first_name = $_POST['first_name'];
$last_name = $_POST['last_name'];
$email = $_POST['email'];
$contact = $_POST['contact'];
$college = $_POST['college'];
$collegecity = $_POST['collegecity'];
$reply = array();

if(empty($first_name)||empty($last_name)||empty($email)||empty($contact)||empty($college)||empty($collegecity))
{
	$reply[0] = "empty";
	echo json_encode($reply);
	die();
}


$con = con();
if(!$con)
{
	$reply[0] = "failure";
	echo json_encode($reply);
	die();
}


$search = "select * from users where email = '$email'";

$res = $con->query($search);


if($res->num_rows > 0){
	$reply[0] = "already" ;
	echo json_encode($reply);
	die();
}
else{
	$insert = "insert into users (firstname,lastname,email,contact,college,collegecity) values ('$first_name','$last_name','$email','$contact','$college','$collegecity')" ;
	$res = $con->query($insert);
	if($res){
		$reply[0] = "success";
	}
	else{
		$reply[0] = "failure" ;
	}
	echo json_encode($reply);
	die();
}
?>