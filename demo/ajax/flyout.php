<?php
header('Content-Type: application/json');

function generateMenu($title, $url, $limit, $depth, $rand) {
    $menu = array();

    for ($i = 0; $i <= $limit; $i++) {
        if ($title !== null) {
            $newTitle = $title . ' > ' . $i;
        } else {
            $newTitle = $i;
        }

        $newUrl = $url . '/' . $i;
        $children = array();

        if ($i === $rand) {
            $menu[] = array(
                'title' => $newTitle
            );

            continue;
        }

        if ($depth && $i != 5) {
            $depth--;
            $children = generateMenu($newTitle, $newUrl, rand(0, 15), $depth, $rand);
        }

        $menu[] = array(
            'title' => $newTitle,
            'url' => $newUrl,
            'children' => $children
        );
    }

    return $menu;
};

echo json_encode(array(
    'title' => 'Root',
    'url' => '/',
    'children' => generateMenu(null, '', 5, 5, rand(0, 15))
));