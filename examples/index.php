<?php

date_default_timezone_set('UTC');

function value($value, $default = '') {
    return isset($_GET[$value]) ? $_GET[$value] : $default;
}

function string($value, $default = '') {
    echo sprintf("'%s'", value($value, $default));
}

function number($value, $default = 0) {
    echo (int) value($value, $default);
}

function bool($value, $default = true) {
    echo value($value, $default, true) ? 'true' : 'false';
}

$shapes = array(
    '' => 'Default',
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

$states = array(
    '' => 'Default',
    'is-info' => 'Info',
    'is-warning' => 'Warning',
    'is-success' => 'Success',
    'is-error' => 'Error'
);

$effects = array(
    '' => '-- None --',
    'visual-gloss' => 'Gloss',
    'visual-reflect' => 'Reflect',
    'visual-glare' => 'Glare',
    'visual-popout' => 'Popout'
);

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
        'js' => array('components/Accordion.js'),
        'filters' => array(
            'className' => array('title' => 'Class', 'type' => 'text'),
            'mode' => array('title' => 'Mode', 'data' => array('click' => 'Click', 'hover' => 'Hover')),
            'defaultIndex' => array('title' => 'Default Index', 'type' => 'number'),
            'multiple' => array('title' => 'Multiple?', 'type' => 'boolean'),
            'collapsible' => array('title' => 'Collapsible?', 'type' => 'boolean')
        )
    ),
    'alert' => array(
        'title' => 'Alert',
        'css' => 'components/alert.css',
        'filters' => array(
            'state' => array('title' => 'State', 'data' => $states),
            'round' => array('title' => 'Round?', 'type' => 'boolean')
        )
    ),
    'breadcrumbs' => array(
        'title' => 'Breadcrumbs',
        'css' => array('components/breadcrumbs.css'),
        'filters' => array(
            'size' => array('title' => 'Size', 'data' => $sizes),
        )
    ),
    'button' => array(
        'title' => 'Button',
        'css' => array('components/button.css'),
        'filters' => array(
            'size' => array('title' => 'Size', 'data' => $sizes),
            'state' => array('title' => 'State', 'data' => $states),
            'shape' => array('title' => 'Shape', 'data' => $shapes),
            'effect' => array('title' => 'Effect', 'data' => $effects),
            'disabled' => array('title' => 'Disabled?', 'type' => 'boolean'),
            'active' => array('title' => 'Active?', 'type' => 'boolean')
        )
    ),
    'button-group' => array(
        'title' => 'Button Group',
        'css' => array('components/button.css', 'components/button-group.css'),
        'filters' => array(
            'count' => array('title' => 'Count', 'type' => 'number', 'default' => 3),
            'size' => array('title' => 'Size', 'data' => $sizes),
            'state' => array('title' => 'State', 'data' => $states),
            'shape' => array('title' => 'Shape', 'data' => $shapes),
            'modifier' => array('title' => 'Modifier', 'data' => array('' => '-- None --', 'vertical' => 'Vertical', 'justified' => 'Justified')),
            'disabled' => array('title' => 'Disabled?', 'type' => 'boolean'),
            'active' => array('title' => 'Active?', 'type' => 'boolean')
        )
    ),
    'carousel' => array(
        'title' => 'Carousel',
        'css' => array('components/carousel.css'),
        'js' => array('components/Carousel.js'),
        'filters' => array(
            'className' => array('title' => 'Class', 'type' => 'text'),
            'animation' => array('title' => 'Animation', 'data' => array('slide' => 'Slide', 'slide-up' => 'Slide Up', 'fade' => 'Fade')),
            'duration' => array('title' => 'Duration', 'type' => 'number', 'default' => 5000),
            'autoCycle' => array('title' => 'Auto Cycle?', 'type' => 'boolean', 'default' => true),
            'stopOnHover' => array('title' => 'Stop On Hover?', 'type' => 'boolean', 'default' => true),
            'count' => array('title' => 'Count', 'type' => 'number', 'default' => 3),
            'tabs' => array('title' => 'Show Tabs?', 'type' => 'boolean', 'default' => true),
            'arrows' => array('title' => 'Show Arrows?', 'type' => 'boolean', 'default' => true),
            'captions' => array('title' => 'Show Captions?', 'type' => 'boolean', 'default' => true)
        )
    ),
    'code' => array(
        'title' => 'Code',
        'css' => array('layout/code.css'),
        'filters' => array(
            'modifier' => array('title' => 'Modifier', 'data' => array('' => '-- None --', 'scrollable' => 'Scrollable'))
        )
    ),
    'dropdown' => array(
        'title' => 'Dropdown',
        'css' => array('components/dropdown.css'),
        'js' => array('components/Toggle.js'),
        'filters' => array(
            'modifier' => array('title' => 'Modifier', 'data' => array('' => '-- None --', 'right' => 'Right Align', 'top' => 'Top Align')),
            'mode' => array('title' => 'Mode', 'data' => array('click' => 'Click', 'hover' => 'Hover')),
            'getTarget' => array('title' => 'Target From', 'type' => 'text', 'default' => 'data-toggle'),
            'hideOpened' => array('title' => 'Hide Other Opened?', 'type' => 'boolean', 'default' => true)
        )
    ),
    'flyout' => array(
        'title' => 'Flyout',
        'css' => array('components/flyout.css'),
        'js' => array('class/Timers.js', 'components/Flyout.js'),
        'filters' => array(
            'className' => array('title' => 'Class', 'type' => 'text'),
            'mode' => array('title' => 'Mode', 'data' => array('click' => 'Click', 'hover' => 'Hover'), 'default' => 'hover'),
            'getUrl' => array('title' => 'URL From', 'type' => 'text', 'default' => 'href'),
            'xOffset' => array('title' => 'X Offset', 'type' => 'number', 'default' => 0),
            'yOffset' => array('title' => 'Y Offset', 'type' => 'number', 'default' => 0),
            'showDelay' => array('title' => 'Show Delay', 'type' => 'number', 'default' => 350),
            'hideDelay' => array('title' => 'Hide Delay', 'type' => 'number', 'default' => 500),
            'itemLimit' => array('title' => 'Column Item Limit', 'type' => 'number', 'default' => 15),
        )
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
        'css' => array('components/button.css', 'components/icon.css'),
        'filters' => array(
            'modifier' => array('title' => 'Modifier', 'data' => array('' => '-- None --', '90deg' => 'Rotate 90', '180deg' => 'Rotate 180', '270deg' => 'Rotate 270'))
        )
    ),
    'label' => array(
        'title' => 'Label',
        'css' => array('components/label.css'),
        'filters' => array(
            'size' => array('title' => 'Size', 'data' => $sizes),
            'state' => array('title' => 'State', 'data' => $states),
            'modifier' => array('title' => 'Modifier', 'data' => array('' => '-- None --', 'badge' => 'Badge', 'arrow-left' => 'Left Arrow', 'arrow-right' => 'Right Arrow', 'ribbon-left' => 'Left Ribbon', 'ribbon-right' => 'Right Ribbon'))
        )
    ),
    'lazy-load' => array(
        'title' => 'Lazy Load',
        'js' => array('components/LazyLoad.js'),
        'filters' => array(
            'delay' => array('title' => 'Force Delay', 'type' => 'number', 'default' => 10000),
            'threshold' => array('title' => 'Threshold', 'type' => 'number', 'default' => 150),
            'forceLoad' => array('title' => 'Force load?', 'type' => 'boolean')
        )
    ),
    'matrix' => array(
        'title' => 'Matrix',
        'css' => array('components/matrix.css'),
        'js' => array('components/Matrix.js'),
        'filters' => array(
            'mode' => array('title' => 'Mode', 'data' => array('single' => 'Single', 'multiple' => 'Multiple')),
            'gutter' => array('title' => 'Gutter', 'type' => 'number', 'default' => 20),
            'rtl' => array('title' => 'Right to left?', 'type' => 'boolean'),
            'defer' => array('title' => 'Defer for images?', 'type' => 'boolean', 'default' => true)
        )
    ),
    'modal' => array(
        'title' => 'Modal',
        'css' => array('components/button.css', 'components/blackout.css', 'components/modal.css'),
        'js' => array('components/Blackout.js', 'components/Modal.js'),
        'filters' => array(
            'className' => array('title' => 'Class', 'type' => 'text'),
            'animation' => array('title' => 'Animation', 'data' => array(
                'fade' => 'Fade',
                'from-above' => 'From Above',
                'from-below' => 'From Below',
                'slide-in-top' => 'Slide In Top',
                'slide-in-right' => 'Slide In Right',
                'slide-in-bottom' => 'Slide In Bottom',
                'slide-in-left' => 'Slide In Left',
                'flip' => 'Flip',
                'flip-vert' => 'Flip Vertical'
            )),
            'ajax' => array('title' => 'Is AJAX?', 'type' => 'boolean', 'default' => true),
            'draggable' => array('title' => 'Is draggable?', 'type' => 'boolean', 'default' => false),
            'blackout' => array('title' => 'Show blackout?', 'type' => 'boolean', 'default' => true),
            'showLoading' => array('title' => 'Show loading?', 'type' => 'boolean', 'default' => true),
        )
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

// Detect theme and component
$componentKey = value('component', 'home');
$themeKey = value('theme', 'titon');

$component = isset($components[$componentKey]) ? $components[$componentKey] : $components['home'];
$theme = isset($themes[$themeKey]) ? $themes[$themeKey] : array();
$vendor = value('vendor', 'mootools');

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
    <link href="../css/toolkit.css" rel="stylesheet" type="text/css">

    <?php if (!empty($theme)) { ?>
        <link href="../css/toolkit/<?php echo $theme['css']; ?>" rel="stylesheet" type="text/css">
    <?php } ?>

    <link href="css/example.css" rel="stylesheet" type="text/css">

    <?php if ($vendor === 'mootools') { ?>
        <script src="js/mootools-core-1.4.5.js"></script>
        <script src="js/mootools-more-1.4.0.1.js"></script>
    <?php } else if ($vendor === 'jquery2') { ?>
        <script src="js/jquery-2.0.3.js"></script>
    <?php } else if ($vendor === 'jquery1') { ?>
        <script src="js/jquery-1.10.2.js"></script>
    <?php } else if ($vendor === 'zepto') { ?>
        <script src="js/zepto-1.0.1.js"></script>
    <?php } ?>

    <?php if (!empty($component['js'])) { ?>
        <script src="../js/<?php echo $vendorFolder; ?>/Titon.js"></script>
        <script src="../js/<?php echo $vendorFolder; ?>/Component.js"></script>

        <?php foreach ((array) $component['js'] as $js) { ?>
            <script src="../js/<?php echo $vendorFolder; ?>/<?php echo $js; ?>"></script>
        <?php }
    } ?>

    <!--[if lte IE 8]>
        <link href="../css/ie8.css" rel="stylesheet" type="text/css">
        <script src="js/respond-1.3.0.js"></script>
        <script src="js/modernizr-2.6.2.js"></script>
    <![endif]-->
</head>
<body class="<?php echo $themeKey; ?>">
    <form action="" method="get" id="skeleton" class="skeleton">
        <?php if (!empty($component['filters'])) { ?>
            <ul class="example-form example-filters">
                <?php foreach ($component['filters'] as $name => $filter) {
                    $default = isset($filter['default']) ? $filter['default'] : null; ?>

                    <li>
                        <label for="<?php echo $name; ?>"><?php echo $filter['title']; ?></label>

                        <?php if (!empty($filter['data'])) {
                            $selected = value($name, $default); ?>

                            <select id="<?php echo $name; ?>" name="<?php echo $name; ?>">
                                <?php foreach ($filter['data'] as $k => $v) { ?>
                                    <option value="<?php echo $k; ?>"<?php if ($selected === $k) echo ' selected'; ?>><?php echo $v; ?></option>
                                <?php } ?>
                            </select>

                        <?php } else if ($filter['type'] === 'text') { ?>
                            <input type="text" id="<?php echo $name; ?>" name="<?php echo $name; ?>" value="<?php echo value($name, $default); ?>">

                        <?php } else if ($filter['type'] === 'number') { ?>
                            <input type="number" id="<?php echo $name; ?>" name="<?php echo $name; ?>" value="<?php echo value($name, $default); ?>" pattern="\d+">

                        <?php } else if ($filter['type'] === 'boolean') { ?>
                            <input type="hidden" name="<?php echo $name; ?>" value="">
                            <input type="checkbox" id="<?php echo $name; ?>" name="<?php echo $name; ?>" value="1"<?php if (value($name, $default)) echo ' checked'; ?>>

                        <?php } ?>
                    </li>
                <?php } ?>

                <li><button type="submit">Go</button></li>
            </ul>
        <?php } ?>

        <div class="example">
            <?php include sprintf('%s.php', $componentKey); ?>
        </div>

        <ul class="example-form example-switcher">
            <li class="resolution"><span id="width"></span>x<span id="height"></span></li>
            <li>
                <label for="component">Component</label>
                <select name="component" id="component">
                    <option value="">-- None --</option>
                    <?php foreach ($components as $key => $value) {
                        if ($key === 'home') {
                            continue;
                        } ?>
                        <option value="<?php echo $key; ?>"<?php if ($key === $componentKey) echo ' selected'; ?>>
                            <?php echo $value['title']; ?>
                            <?php if (!empty($value['js'])) echo '(JS)'; ?>
                        </option>
                    <?php } ?>
                </select>
            </li>
            <li>
                <label for="theme">Theme</label>
                <select name="theme" id="theme">
                    <option value="">-- None --</option>
                    <?php foreach ($themes as $key => $value) { ?>
                        <option value="<?php echo $key; ?>"<?php if ($key === $themeKey) echo ' selected'; ?>><?php echo $value['title']; ?></option>
                    <?php } ?>
                </select>
            </li>
            <li>
                <label for="vendor">Vendor</label>
                <select name="vendor" id="vendor">
                    <option value="mootools"<?php if ($vendor === 'mootools') echo ' selected'; ?>>MooTools</option>
                    <option value="jquery1"<?php if ($vendor === 'jquery1') echo ' selected'; ?>>jQuery 1.10</option>
                    <option value="jquery2"<?php if ($vendor === 'jquery2') echo ' selected'; ?>>jQuery 2</option>
                </select>
            </li>
            <li><button type="submit">Go</button></li>
        </ul>
    </form>

    <script>
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