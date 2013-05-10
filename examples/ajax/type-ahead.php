<?php
$funcs = get_defined_functions();
$funcs = $funcs['internal'];

// Shuffle it so we can sort in JS
shuffle($funcs);

echo json_encode($funcs);