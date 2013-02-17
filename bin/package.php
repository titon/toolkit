<?php

// Includes, no need for an auto-loader
require_once 'jsmin/jsmin.php';
require_once 'packager/Packager.php';
require_once 'packager/Minifier.php';
require_once 'packager/minifiers/JsMinifier.php';

use \mjohnson\packager\Packager;
use \mjohnson\packager\minifiers\JsMinifier;

// Fetch variables
$items = isset($_GET['items']) ? explode(',', $_GET['items']) : array();
$minify = isset($_GET['minify']) ? (bool) $_GET['minify'] : true;

if ($minify) {
	$packager = new Packager(dirname(__DIR__), new JsMinifier());
} else {
	$packager = new Packager(dirname(__DIR__));
}

// Package the contents
if ($packager->package($items)) {
	$scripts = $packager->getItems();
	$package = $packager->getPackage();

	echo 'Package created with: ' . implode(', ', array_keys($package)) . '<br><br>';

	// Gather Mootools dependencies
	$mootools = array();

	foreach ($package as $script => $path) {
		if (isset($scripts[$script]['externalRequires'])) {
			$mootools = array_merge($mootools, $scripts[$script]['externalRequires']);
		}
	}

	sort($mootools);

	echo 'MooTools dependencies: ' . implode(', ', array_unique($mootools));
}