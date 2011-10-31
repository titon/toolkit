<?php 

header('Content-Type: application/json');

$menu = array();
$child = array(array(
	'title' => 'Child',
	'url' => '#'
));

for ($i = 0; $i < 10; $i++) {
	$menu[] = array(
		'title' => 'Title #' . $i,
		'url' => 'http://titon/js/tests/index.php?i=' . $i,
		'className' => 'row-' . $i,
		'children' => $child
	);
}

echo json_encode(array(
	'title' => 'Root',
	'url' => 'http://titon/js/tests/index.php',
	'children' => $menu
));