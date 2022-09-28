<?php
use Gt\DomTemplate\DocumentBinder;

function go(DocumentBinder $binder):void {
	$binder->bindKeyValue("time", date("H:i:s"));
}
