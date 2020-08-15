<?php


function validate($val){
	$val=htmlentities($val);
	$val=trim($val);
	return $val;
}


function con(){
	$dbhost="localhost";
	$dbuname="avishkar2017";
	$dbpassword="codegeaSS1947";
	$dbname="mnnitavishkar";
	$con=new MySQLi($dbhost,$dbuname,$dbpassword,$dbname);
	if($con->connect_errno){
		die("Not able to connect to database".$con->connect_error);
	}
	else 
	{
		return $con;
	}
}


/*function con(){
	$dbhost="localhost";
	$dbuname="root";
	$dbpassword="";
	$dbname="avishkar";
	$con=new MySQLi($dbhost,$dbuname,$dbpassword,$dbname);
	if($con->connect_errno){
		die("Not able to connect to database".$con->connect_error);
	}
	else 
	{
		return $con;
	}
}
*/

?>