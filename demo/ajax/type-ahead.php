<?php
$funcs = get_defined_functions();
$funcs = $funcs['internal'];

if (isset($_GET['term'])) {
    $clean = array();
    $term = $_GET['term'];

    foreach ($funcs as $func) {
        if (strpos($func, $term) !== false) {
            $clean[] = $func;
        }
    }

    sort($clean);
} else {
    $clean = $funcs;
    shuffle($clean);
}

$clean = array_map(function($value) {
    return array('title' => $value);
}, $clean);

echo json_encode($clean);