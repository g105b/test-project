<?php
use Gt\Dom\HTMLDocument;
use Gt\Http\Header\ResponseHeaders;
use Gt\Http\Uri;

function go(
	Uri $uri,
	HTMLDocument $document,
	ResponseHeaders $headers,
):void {
	usleep(500_000);

	foreach($document->querySelectorAll("body>header nav ul>li>a") as $a) {
		if($uri->getPath() === $a->href) {
			$a->parentElement->classList->add("current");
		}
	}

	$headers->set("ungabi", rand(1, 1000));
	$headers->set("expires", gmdate("D, d M Y H:i:s T", strtotime("+1 min")));
}
