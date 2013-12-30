<?php
header('Content-Type: application/json');

echo json_encode(array(
    'time' => time(),
    'callback' => isset($_GET['callback']) ? $_GET['callback'] : ''
));