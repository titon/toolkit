<?php

date_default_timezone_set('UTC');

$components = array(
    'home' => array(
        'title' => 'Titon Toolkit'
    ),
    'base' => array(
        'title' => 'Base',
        'css' => 'layout/typography.css',
    ),
    'accordion' => array(
        'title' => 'Accordion',
        'css' => 'modules/accordion.css',
        'js' => array('modules/Accordion.js')
    ),
    'alert' => array(
        'title' => 'Alert',
        'css' => 'ui/alert.css'
    ),
    'breadcrumbs' => array(
        'title' => 'Breadcrumbs',
        'css' => array('ui/breadcrumbs.css')
    ),
    'button' => array(
        'title' => 'Button',
        'css' => array('ui/button.css')
    ),
    'button-group' => array(
        'title' => 'Button Group',
        'css' => array('ui/button.css', 'ui/button-group.css', 'ui/dropdown.css')
    ),
    'carousel' => array(
        'title' => 'Carousel',
        'css' => array('modules/carousel.css'),
        'js' => array('modules/Carousel.js')
    ),
    'code' => array(
        'title' => 'Code',
        'css' => array('layout/code.css')
    ),
    'dropdown' => array(
        'title' => 'Dropdown',
        'css' => array('ui/button.css', 'ui/button-group.css', 'ui/dropdown.css'),
        'js' => array('modules/Toggle.js')
    ),
    'flyout' => array(
        'title' => 'Flyout',
        'css' => array('ui/button.css', 'modules/flyout.css'),
        'js' => array('class/Timers.js', 'modules/Flyout.js')
    ),
    'form' => array(
        'title' => 'Form & Input Group',
        'css' => array('ui/button.css', 'layout/grid.css', 'layout/form.css', 'layout/input-group.css', 'ui/dropdown.css')
    ),
    'grid' => array(
        'title' => 'Grid & Responsive',
        'css' => array('layout/grid.css', 'layout/responsive.css')
    ),
    'icon' => array(
        'title' => 'Icon',
        'css' => array('ui/button.css', 'ui/icon.css')
    ),
    'label-badge' => array(
        'title' => 'Label & Badge',
        'css' => array('ui/label-badge.css')
    ),
    'lazy-load' => array(
        'title' => 'Lazy Load',
        'js' => array('modules/LazyLoad.js')
    ),
    'matrix' => array(
        'title' => 'Matrix',
        'css' => array('ui/matrix.css'),
        'js' => array('modules/Matrix.js')
    ),
    'modal' => array(
        'title' => 'Modal',
        'css' => array('ui/button.css', 'modules/blackout.css', 'modules/modal.css'),
        'js' => array('modules/Blackout.js', 'modules/Modal.js')
    ),
    'pagination' => array(
        'title' => 'Pagination',
        'css' => array('ui/button.css', 'ui/pagination.css')
    ),
    'pin' => array(
        'title' => 'Pin',
        'js' => array('modules/Pin.js'),
        'css' => array('ui/pin.css')
    ),
    'popover' => array(
        'title' => 'Popover',
        'css' => array('ui/button.css', 'modules/tooltip.css', 'modules/popover.css'),
        'js' => array('modules/Tooltip.js', 'modules/Popover.js')
    ),
    'progress' => array(
        'title' => 'Progress Bar',
        'css' => array('ui/progress.css'),
    ),
    'showcase' => array(
        'title' => 'Showcase',
        'css' => array('modules/blackout.css', 'modules/showcase.css'),
        'js' => array('modules/Blackout.js', 'modules/Showcase.js')
    ),
    'table' => array(
        'title' => 'Table',
        'css' => array('layout/table.css'),
    ),
    'tabs' => array(
        'title' => 'Tabs',
        'css' => array('ui/button.css', 'ui/button-group.css', 'modules/tabs.css', 'layout/grid.css'),
        'js' => array('modules/Tabs.js')
    ),
    'tooltip' => array(
        'title' => 'Tooltip',
        'css' => array('ui/button.css', 'modules/tooltip.css'),
        'js' => array('modules/Tooltip.js')
    ),
    'type-ahead' => array(
        'title' => 'Type Ahead',
        'css' => array('modules/type-ahead.css'),
        'js' => array('class/Cache.js', 'modules/TypeAhead.js')
    ),
);

$themes = array(
    'titon' => array(
        'title' => 'Titon',
        'css' => 'themes/titon.css'
    ),
    'tomorrow-night' => array(
        'title' => 'Tomorrow Night',
        'css' => 'themes/tomorrow-night.css'
    )
);

$shapes = array(
    '' => 'Square',
    'round' => 'Round',
    'pill' => 'Pill',
    'oval' => 'Oval',
    'skew' => 'Skew'
);

$sizes = array(
    'small' => 'Small',
    '' => 'Medium',
    'large' => 'Large'
);

$types = array(
    '' => 'Default',
    'is-info' => 'Information',
    'is-warning' => 'Warning',
    'is-success' => 'Success',
    'is-error' => 'Error'
);

$visuals = array(
    'visual-gloss' => 'Gloss',
    'visual-reflect' => 'Reflect',
    'visual-glare' => 'Glare',
    'visual-popout' => 'Popout'
);

// Detect theme and component
$componentKey = 'home';
$themeKey = 'titon';

if (isset($_GET['component']) && isset($components[$_GET['component']])) {
    $componentKey = $_GET['component'];
}

if (isset($_GET['theme'])) {
    $themeKey = $_GET['theme'];
}

$component = $components[$componentKey];
$theme = isset($themes[$themeKey]) ? $themes[$themeKey] : array();
$vendor = isset($_GET['vendor']) ? $_GET['vendor'] : 'mootools';

if ($vendor === 'mootools') {
    $vendorFolder = 'mootools';
} else {
    $vendorFolder = 'jquery';
} ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Titon - Toolkit - <?php echo $component['title']; ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet" type="text/css">
    <link href="../css/normalize.css" rel="stylesheet" type="text/css">
    <link href="../css/toolkit.css" rel="stylesheet" type="text/css">

    <?php if (!empty($theme)) { ?>
        <link href="../css/toolkit/<?php echo $theme['css']; ?>" rel="stylesheet" type="text/css">
    <?php } ?>

    <link href="css/test.css" rel="stylesheet" type="text/css">

    <?php if ($vendor === 'mootools') { ?>
        <script type="text/javascript" src="js/mootools-core-1.4.5.js"></script>
        <script type="text/javascript" src="js/mootools-more-1.4.0.1.js"></script>
    <?php } else if ($vendor === 'jquery2') { ?>
        <script type="text/javascript" src="js/jquery-2.0.3.js"></script>
    <?php } else if ($vendor === 'jquery1') { ?>
        <script type="text/javascript" src="js/jquery-1.10.2.js"></script>
    <?php } else if ($vendor === 'zepto') { ?>
        <script type="text/javascript" src="js/zepto-1.0.1.js"></script>
    <?php } ?>

    <?php if (!empty($component['js'])) { ?>
        <script type="text/javascript" src="../js/<?php echo $vendorFolder; ?>/Titon.js"></script>
        <script type="text/javascript" src="../js/<?php echo $vendorFolder; ?>/Component.js"></script>

        <?php foreach ((array) $component['js'] as $js) { ?>
            <script type="text/javascript" src="../js/<?php echo $vendorFolder; ?>/<?php echo $js; ?>"></script>
        <?php }
    } ?>

    <!--[if lte IE 8]>
        <link href="../css/ie8.css" rel="stylesheet" type="text/css">
        <script type="text/javascript" src="js/respond-1.3.0.js"></script>
        <script type="text/javascript" src="js/modernizr-2.6.2.js"></script>
    <![endif]-->
</head>
<body class="<?php echo $themeKey; ?>">
    <div id="wrapper" class="skeleton">
        <?php include sprintf('%s.php', $componentKey); ?>

        <form action="" method="get" class="test-switcher">
            <label for="component">Component</label>
            <select name="component" id="component">
                <option value="">-- None --</option>
                <?php foreach ($components as $key => $value) {
                    if ($key === 'home') {
                        continue;
                    } ?>
                    <option value="<?php echo $key; ?>"<?php if ($key === $componentKey) echo ' selected="selected"'; ?>>
                        <?php echo $value['title']; ?>
                        <?php if (!empty($value['js'])) echo '(JS)'; ?>
                    </option>
                <?php } ?>
            </select>

            <label for="theme">Theme</label>
            <select name="theme" id="theme">
                <option value="">-- None --</option>
                <?php foreach ($themes as $key => $value) { ?>
                    <option value="<?php echo $key; ?>"<?php if ($key === $themeKey) echo ' selected="selected"'; ?>><?php echo $value['title']; ?></option>
                <?php } ?>
            </select>

            <label for="vendor">Vendor</label>
            <select name="vendor" id="vendor">
                <option value="mootools"<?php if ($vendor === 'mootools') echo ' selected="selected"'; ?>>MooTools</option>
                <option value="jquery1"<?php if ($vendor === 'jquery1') echo ' selected="selected"'; ?>>jQuery 1.10</option>
                <option value="jquery2"<?php if ($vendor === 'jquery2') echo ' selected="selected"'; ?>>jQuery 2</option>
                <?php /*<option value="zepto"<?php if ($vendor === 'zepto') echo ' selected="selected"'; ?>>Zepto</option>*/ ?>
            </select>

            <button type="submit">GO</button>
        </form>
    </div>
</body>
</html>