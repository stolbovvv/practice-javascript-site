<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$_POST = json_decode( file_get_contents("php://input"), true );

echo var_dump($_POST);