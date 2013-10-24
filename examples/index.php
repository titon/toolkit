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
        'css' => 'components/accordion.css',
        'js' => array('components/Accordion.js')
    ),
    'alert' => array(
        'title' => 'Alert',
        'css' => 'components/alert.css'
    ),
    'breadcrumbs' => array(
        'title' => 'Breadcrumbs',
        'css' => array('components/breadcrumbs.css')
    ),
    'button' => array(
        'title' => 'Button',
        'css' => array('components/button.css')
    ),
    'button-group' => array(
        'title' => 'Button Group',
        'css' => array('components/button.css', 'components/button-group.css', 'components/dropdown.css')
    ),
    'carousel' => array(
        'title' => 'Carousel',
        'css' => array('components/carousel.css'),
        'js' => array('components/Carousel.js')
    ),
    'code' => array(
        'title' => 'Code',
        'css' => array('layout/code.css')
    ),
    'dropdown' => array(
        'title' => 'Dropdown',
        'css' => array('components/button.css', 'components/button-group.css', 'components/dropdown.css'),
        'js' => array('components/Toggle.js')
    ),
    'flyout' => array(
        'title' => 'Flyout',
        'css' => array('components/button.css', 'components/flyout.css'),
        'js' => array('class/Timers.js', 'components/Flyout.js')
    ),
    'form' => array(
        'title' => 'Form & Input Group',
        'css' => array('components/button.css', 'layout/grid.css', 'layout/form.css', 'layout/input-group.css', 'components/dropdown.css')
    ),
    'grid' => array(
        'title' => 'Grid & Responsive',
        'css' => array('layout/grid.css', 'layout/responsive.css')
    ),
    'icon' => array(
        'title' => 'Icon',
        'css' => array('components/button.css', 'components/icon.css')
    ),
    'label' => array(
        'title' => 'Label',
        'css' => array('components/label.css')
    ),
    'lazy-load' => array(
        'title' => 'Lazy Load',
        'js' => array('components/LazyLoad.js')
    ),
    'matrix' => array(
        'title' => 'Matrix',
        'css' => array('components/matrix.css'),
        'js' => array('components/Matrix.js')
    ),
    'modal' => array(
        'title' => 'Modal',
        'css' => array('components/button.css', 'components/blackout.css', 'components/modal.css'),
        'js' => array('components/Blackout.js', 'components/Modal.js')
    ),
    'pagination' => array(
        'title' => 'Pagination',
        'css' => array('components/button.css', 'components/pagination.css')
    ),
    'pin' => array(
        'title' => 'Pin',
        'js' => array('components/Pin.js'),
        'css' => array('components/pin.css')
    ),
    'popover' => array(
        'title' => 'Popover',
        'css' => array('components/button.css', 'components/tooltip.css', 'components/popover.css'),
        'js' => array('components/Tooltip.js', 'components/Popover.js')
    ),
    'progress' => array(
        'title' => 'Progress Bar',
        'css' => array('components/progress.css'),
    ),
    'showcase' => array(
        'title' => 'Showcase',
        'css' => array('components/blackout.css', 'components/showcase.css'),
        'js' => array('components/Blackout.js', 'components/Showcase.js')
    ),
    'table' => array(
        'title' => 'Table',
        'css' => array('layout/table.css'),
    ),
    'tabs' => array(
        'title' => 'Tabs',
        'css' => array('components/button.css', 'components/button-group.css', 'components/tabs.css', 'layout/grid.css'),
        'js' => array('components/Tabs.js')
    ),
    'tooltip' => array(
        'title' => 'Tooltip',
        'css' => array('components/button.css', 'components/tooltip.css'),
        'js' => array('components/Tooltip.js')
    ),
    'type-ahead' => array(
        'title' => 'Type Ahead',
        'css' => array('components/type-ahead.css'),
        'js' => array('class/Cache.js', 'components/TypeAhead.js')
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

            <span id="width"></span>x<span id="height"></span>
        </form>
    </div>

    <script type="text/javascript">
        <?php if ($vendor === 'mootools') { ?>
            function resize() {
                $('width').set('html', window.getWidth());
                $('height').set('html', window.getHeight());
            }

            window.addEvent('domready', resize).addEvent('resize', resize);
        <?php } else { ?>
            function resize() {
                $('#width').html($(window).width());
                $('#height').html($(window).height());
            }

            $(document).ready(resize);
            $(window).on('resize', resize);
        <?php } ?>
    </script>
</body>
</html>