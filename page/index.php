<?php
use Gt\DomTemplate\DocumentBinder;
use Gt\Http\Header\Headers;
use Gt\Http\Response;
use Gt\Input\Input;
use Gt\Session\Session;

function go(
	DocumentBinder $binder,
	Session $session,
	Input $input,
):void {
	$binder->bindKeyValue("your-name", $session->getString("your-name"));
	if($test = $input->getString("test")) {
		$binder->bindKeyValue("test", $test);
	}

//	echo $_GET["test"];
}

function do_greet(
	Input $input,
	DocumentBinder $binder,
	Session $session,
	Response $response,
):void {
	if($name = $input->getString("your-name") ?? $session->getString("your-name")) {
		$binder->bindKeyValue("your-name", $name);
		$session->set("your-name", $name);
	}

	$response->reload();
}
