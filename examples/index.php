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
            'mode' => array('title' => 'Mode', 'data' => array('click' => 'Click', 'hover' => 'Hover')),
            'defaultIndex' => array('title' => 'Default Index', 'type' => 'number', 'default' => 0),
            'multiple' => array('title' => 'Multiple?', 'type' => 'boolean'),
            'collapsible' => array('title' => 'Collapsible?', 'type' => 'boolean')
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
            'animation' => array('title' => 'Animation', 'data' => array(
                'slide' => 'Slide',
                'slide-up' => 'Slide Up',
                'fade' => 'Fade'
            )),
            'modifier' => array('title' => 'Modifier', 'data' => array(
                '' => 'Default (4:3)',
                'wide' => 'Wide (16:9)',
                'square' => 'Square (1:1)'
            ), 'default' => ''),
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
        'js' => array('components/Dropdown.js'),
        'filters' => array(
            'modifier' => array('title' => 'Modifier', 'data' => array(
                '' => '-- None --',
                'top' => 'Top Align',
                'right' => 'Right Align',
                'left' => 'Left Align'
            )),
            'align' => array('title' => 'Alignment', 'data' => array(
                '' => '-- None --',
                'push' => 'Push (Horizontal)',
                'pull' => 'Pull (Vertical)'
            )),
            'mode' => array('title' => 'Mode', 'data' => array('click' => 'Click', 'hover' => 'Hover')),
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
            'xOffset' => array('title' => 'X Offset', 'type' => 'number', 'default' => 0),
            'yOffset' => array('title' => 'Y Offset', 'type' => 'number', 'default' => 0),
            'showDelay' => array('title' => 'Hover Show Delay', 'type' => 'number', 'default' => 350),
            'hideDelay' => array('title' => 'Hover Hide Delay', 'type' => 'number', 'default' => 500),
            'itemLimit' => array('title' => 'Column Item Limit', 'type' => 'number', 'default' => 15),
        )
    ),
    'form' => array(
        'title' => 'Form',
        'css' => array('layout/form.css'),
        'filters' => array(
            'state' => array('title' => 'State', 'data' => array('' => 'Default', 'is-error' => 'Error', 'is-success' => 'Success')),
            'required' => array('title' => 'Required?', 'type' => 'boolean', 'default' => false),
            'disabled' => array('title' => 'Disabled?', 'type' => 'boolean', 'default' => false)
        )
    ),
    'grid' => array(
        'title' => 'Grid',
        'css' => array('layout/grid.css')
    ),
    'icon' => array(
        'title' => 'Icon',
        'css' => array('components/icon.css'),
        'filters' => array(
            'modifier' => array('title' => 'Modifier', 'data' => array(
                '' => '-- None --',
                '90deg' => 'Rotate 90',
                '180deg' => 'Rotate 180',
                '270deg' => 'Rotate 270',
                'rotate' => 'Rotate Animation',
                'flip' => 'Flip Horizontal',
                'flip-vert' => 'Flip Vertical'
            ))
        )
    ),
    'input' => array(
        'title' => 'Input',
        'css' => array('components/input.css'),
        'js' => array('components/Input.js'),
        'filters' => array(
            'checkbox' => array('title' => 'Checkbox?', 'type' => 'boolean', 'default' => true),
            'radio' => array('title' => 'Radio?', 'type' => 'boolean', 'default' => true),
            'select' => array('title' => 'Select?', 'type' => 'boolean', 'default' => true),
            'disabled' => array('title' => 'Disabled?', 'type' => 'boolean', 'default' => false)
        )
    ),
    'input-group' => array(
        'title' => 'Input Group',
        'css' => array('components/input-group.css'),
        'filters' => array(
            'round' => array('title' => 'Round?', 'type' => 'boolean')
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
        'css' => array('components/lazy-load.css'),
        'js' => array('components/LazyLoad.js'),
        'filters' => array(
            'delay' => array('title' => 'Force Delay', 'type' => 'number', 'default' => 10000),
            'threshold' => array('title' => 'Threshold', 'type' => 'number', 'default' => 150),
            'throttle' => array('title' => 'Throttle', 'type' => 'number', 'default' => 50),
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
        'css' => array('components/blackout.css', 'components/modal.css'),
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
                'sticky-top' => 'Sticky Top',
                'sticky-right' => 'Sticky Right',
                'sticky-bottom' => 'Sticky Bottom',
                'sticky-left' => 'Sticky Left',
                'flip' => 'Flip',
                'flip-vert' => 'Flip Vertical'
            )),
            'ajax' => array('title' => 'Is AJAX?', 'type' => 'boolean', 'default' => true),
            'draggable' => array('title' => 'Is draggable?', 'type' => 'boolean', 'default' => false),
            'fullScreen' => array('title' => 'Full screen?', 'type' => 'boolean', 'default' => false),
            'blackout' => array('title' => 'Show blackout?', 'type' => 'boolean', 'default' => true),
            'showLoading' => array('title' => 'Show loading?', 'type' => 'boolean', 'default' => true),
        )
    ),
    'notice' => array(
        'title' => 'Notice',
        'css' => 'components/notice.css',
        'filters' => array(
            'state' => array('title' => 'State', 'data' => $states),
            'round' => array('title' => 'Round?', 'type' => 'boolean')
        )
    ),
    'pagination' => array(
        'title' => 'Pagination',
        'css' => array('components/button.css', 'components/pagination.css'),
        'filters' => array(
            'modifier' => array('title' => 'Modifier', 'data' => array('' => '-- None --', 'grouped' => 'Grouped')),
            'size' => array('title' => 'Size', 'data' => $sizes),
            'state' => array('title' => 'State', 'data' => $states),
            'shape' => array('title' => 'Shape (Grouped)', 'data' => $shapes),
            'count' => array('title' => 'Count', 'type' => 'number', 'default' => 5),
        )
    ),
    'pin' => array(
        'title' => 'Pin',
        'js' => array('components/Pin.js'),
        'css' => array('components/pin.css'),
        'filters' => array(
            'animation' => array('title' => 'Animation', 'data' => array('' => '-- None --', 'sticky' => 'Sticky', 'slide' => 'Slide')),
            'location' => array('title' => 'Location', 'data' => array('right' => 'Right', 'left' => 'Left'), 'default' => 'right'),
            'xOffset' => array('title' => 'X Offset', 'type' => 'number', 'default' => 0),
            'yOffset' => array('title' => 'Y Offset', 'type' => 'number', 'default' => 0),
            'throttle' => array('title' => 'Throttle', 'type' => 'number', 'default' => 50),
            'fixed' => array('title' => 'Fixed?', 'type' => 'boolean', 'default' => false),
            'height' => array('title' => 'Default Height', 'type' => 'number'),
            'top' => array('title' => 'Default Top', 'type' => 'number')
        )
    ),
    'popover' => array(
        'title' => 'Popover',
        'css' => array('components/tooltip.css', 'components/popover.css'),
        'js' => array('components/Tooltip.js', 'components/Popover.js'),
        'filters' => array(
            'className' => array('title' => 'Class', 'type' => 'text'),
            'animation' => array('title' => 'Animation', 'data' => array(
                '' => '-- None -- ',
                'fade' => 'Fade',
                'from-above' => 'From Above',
                'from-below' => 'From Below',
                'flip-rotate' => 'Flip Rotate',
                'slide-in' => 'Slide In'
            )),
            'position' => array('title' => 'Position', 'data' => array(
                'topLeft' => 'Top Left',
                'topCenter' => 'Top Center',
                'topRight' => 'Top Right',
                'centerLeft' => 'Center Left',
                'centerRight' => 'Center Right',
                'bottomLeft' => 'Bottom Left',
                'bottomCenter' => 'Bottom Center',
                'bottomRight' => 'Bottom Right'
            ), 'default' => 'topRight'),
            'xOffset' => array('title' => 'X Offset', 'type' => 'number', 'default' => 0),
            'yOffset' => array('title' => 'Y Offset', 'type' => 'number', 'default' => 0),
            'delay' => array('title' => 'Delay', 'type' => 'number', 'default' => 0),
            'ajax' => array('title' => 'Is AJAX?', 'type' => 'boolean', 'default' => false),
            'showLoading' => array('title' => 'Show loading?', 'type' => 'boolean', 'default' => true),
            'showTitle' => array('title' => 'Show title?', 'type' => 'boolean', 'default' => true),
        )
    ),
    'progress' => array(
        'title' => 'Progress Bar',
        'css' => array('components/progress.css'),
        'filters' => array(
            'size' => array('title' => 'Size', 'data' => $sizes),
            'state' => array('title' => 'State', 'data' => $states),
            'width' => array('title' => 'Width', 'type' => 'number', 'default' => 55)
        )
    ),
    'responsive' => array(
        'title' => 'Responsive',
        'css' => array('layout/responsive.css')
    ),
    'showcase' => array(
        'title' => 'Showcase',
        'css' => array('components/blackout.css', 'components/showcase.css'),
        'js' => array('components/Blackout.js', 'components/Showcase.js'),
        'filters' => array(
            'className' => array('title' => 'Class', 'type' => 'text'),
            'gutter' => array('title' => 'Gutter Margin', 'type' => 'number', 'default' => 50),
            'blackout' => array('title' => 'Show blackout?', 'type' => 'boolean', 'default' => true),
            'group' => array('title' => 'Grouped?', 'type' => 'boolean', 'default' => true),
            'count' => array('title' => 'Count', 'type' => 'number', 'default' => 5)
        )
    ),
    'stalker' => array(
        'title' => 'Stalker',
        'js' => array('components/Stalker.js'),
        'filters' => array(
            'threshold' => array('title' => 'Threshold', 'type' => 'number', 'default' => 50),
            'throttle' => array('title' => 'Throttle', 'type' => 'number', 'default' => 50),
            'applyToParent' => array('title' => 'Apply active to parent?', 'type' => 'boolean', 'default' => true),
        )
    ),
    'table' => array(
        'title' => 'Table',
        'css' => array('layout/table.css'),
        'filters' => array(
            'modifier' => array('title' => 'Modifier', 'data' => array('' => '-- None --', 'hover' => 'Row Hover', 'sortable' => 'Sortable Header', 'compact' => 'Compact Rows')),
            'count' => array('title' => 'Count', 'type' => 'number', 'default' => 25)
        )
    ),
    'tabs' => array(
        'title' => 'Tabs',
        'css' => array('components/tabs.css'),
        'js' => array('components/Tabs.js'),
        'filters' => array(
            'mode' => array('title' => 'Mode', 'data' => array('click' => 'Click', 'hover' => 'Hover'), 'default' => 'click'),
            'defaultIndex' => array('title' => 'Default Index', 'type' => 'number', 'default' => 0),
            'cookie' => array('title' => 'Cookie Name', 'type' => 'text'),
            'cookieDuration' => array('title' => 'Cookie Duration', 'type' => 'number', 'default' => 30),
            'ajax' => array('title' => 'Allow AJAX?', 'type' => 'boolean', 'default' => true),
            'collapsible' => array('title' => 'Collapsible?', 'type' => 'boolean', 'default' => false),
            'persistState' => array('title' => 'Persist state?', 'type' => 'boolean', 'default' => false),
            'preventDefault' => array('title' => 'Prevent default?', 'type' => 'boolean', 'default' => true),
        )
    ),
    'tooltip' => array(
        'title' => 'Tooltip',
        'css' => array('components/tooltip.css'),
        'js' => array('components/Tooltip.js'),
        'filters' => array(
            'className' => array('title' => 'Class', 'type' => 'text'),
            'animation' => array('title' => 'Animation', 'data' => array(
                '' => '-- None -- ',
                'fade' => 'Fade',
                'from-above' => 'From Above',
                'from-below' => 'From Below',
                'flip-rotate' => 'Flip Rotate',
                'slide-in' => 'Slide In'
            )),
            'position' => array('title' => 'Position', 'data' => array(
                'topLeft' => 'Top Left',
                'topCenter' => 'Top Center',
                'topRight' => 'Top Right',
                'centerLeft' => 'Center Left',
                'centerRight' => 'Center Right',
                'bottomLeft' => 'Bottom Left',
                'bottomCenter' => 'Bottom Center',
                'bottomRight' => 'Bottom Right'
            ), 'default' => 'topRight'),
            'mode' => array('title' => 'Mode', 'data' => array('click' => 'Click', 'hover' => 'Hover'), 'default' => 'hover'),
            'mouseThrottle' => array('title' => 'Mouse Throttle', 'type' => 'number', 'default' => 50),
            'xOffset' => array('title' => 'X Offset', 'type' => 'number', 'default' => 0),
            'yOffset' => array('title' => 'Y Offset', 'type' => 'number', 'default' => 0),
            'delay' => array('title' => 'Delay', 'type' => 'number', 'default' => 0),
            'ajax' => array('title' => 'Is AJAX?', 'type' => 'boolean', 'default' => false),
            'follow' => array('title' => 'Follow mouse?', 'type' => 'boolean', 'default' => false),
            'showLoading' => array('title' => 'Show loading?', 'type' => 'boolean', 'default' => true),
            'showTitle' => array('title' => 'Show title?', 'type' => 'boolean', 'default' => true),
        )
    ),
    'type-ahead' => array(
        'title' => 'Type Ahead',
        'css' => array('components/type-ahead.css'),
        'js' => array('class/Cache.js', 'components/TypeAhead.js'),
        'filters' => array(
            'className' => array('title' => 'Class', 'type' => 'text'),
            'minLength' => array('title' => 'Minimum Characters', 'type' => 'number', 'default' => 1),
            'itemLimit' => array('title' => 'Item Limit', 'type' => 'number', 'default' => 15),
            'throttle' => array('title' => 'Lookup Throttle', 'type' => 'number', 'default' => 250),
            'prefetch' => array('title' => 'Prefetch lookup?', 'type' => 'boolean', 'default' => false),
            'shadow' => array('title' => 'Shadow text?', 'type' => 'boolean', 'default' => false),
        )
    ),
);

$themes = array(
    'titon' => array(
        'title' => 'Titon',
        'css' => 'themes/titon.css'
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
        <script src="js/jquery-ui-1.10.3.custom.js"></script>

    <?php } else if ($vendor === 'jquery1') { ?>
        <script src="js/jquery-1.10.2.js"></script>
        <script src="js/jquery-ui-1.10.3.custom.js"></script>

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
    <div id="skeleton" class="skeleton">
        <form action="" method="get">
            <ul class="example-form example-filters">
                <?php if (!empty($component['filters'])) {
                    foreach ($component['filters'] as $name => $filter) {
                        $default = isset($filter['default']) ? $filter['default'] : ''; ?>

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

                    <li>
                        <input type="hidden" name="component" value="<?php echo value('component'); ?>">
                        <input type="hidden" name="theme" value="<?php echo value('theme', 'titon'); ?>">
                        <input type="hidden" name="vendor" value="<?php echo value('vendor', 'mootools'); ?>">
                        <button type="submit">Filter</button>
                    </li>
                <?php } ?>

                <li>&nbsp;</li>
            </ul>
        </form>

        <div class="example">
            <?php include sprintf('%s.php', $componentKey ?: 'home'); ?>
        </div>

        <form action="" method="get">
            <ul class="example-form example-switcher">
                <li class="resolution">
                    <span id="res-width"></span>x<span id="res-height"></span>
                </li>
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
    </div>

    <script>
        <?php if ($vendor === 'mootools') { ?>
            function resize() {
                $('res-width').set('html', window.getWidth());
                $('res-height').set('html', window.getHeight());
            }

            window.addEvent('domready', resize).addEvent('resize', resize);
        <?php } else { ?>
            function resize() {
                $('#res-width').html($(window).width());
                $('#res-height').html($(window).height());
            }

            $(document).ready(resize);
            $(window).on('resize', resize);
        <?php } ?>
    </script>
</body>
</html>