<?php

$assets = array(
	'base' => array(
		'title' => 'Base',
		'css' => 'ui/base.css'
	),
	'alert' => array(
		'title' => 'Alert',
		'css' => 'ui/alert.css'
	),
	'button' => array(
		'title' => 'Button',
		'css' => array('ui/button.css')
	),
	'button-group' => array(
		'title' => 'Button Group',
		'css' => array('ui/button.css', 'ui/button-group.css', 'ui/effects/button-group.css')
	),
	'flyout' => array(
		'title' => 'Flyout',
		'css' => array('ui/button.css', 'modules/flyout.css'),
		'js' => array('class/Timers.js', 'modules/Flyout.js')
	),
	'icon' => array(
		'title' => 'Icon',
		'css' => array('ui/button.css', 'ui/icon.css')
	),
	'label-badge' => array(
		'title' => 'Label & Badge',
		'css' => array('ui/label-badge.css', 'ui/effects/label.css')
	),
	'lazy-load' => array(
		'title' => 'LazyLoad',
		'js' => array('utilities/LazyLoad.js')
	),
	'modal' => array(
		'title' => 'Modal',
		'css' => array('ui/button.css', 'modules/blackout.css', 'modules/modal.css'),
		'js' => array('modules/Blackout.js', 'modules/Modal.js')
	),
	'pagination' => array(
		'title' => 'Pagination',
		'css' => array('ui/button.css', 'ui/pagination.css', 'ui/effects/pagination.css')
	),
	'popover' => array(
		'title' => 'Popover',
		'css' => array('ui/button.css', 'modules/popover.css'),
		'js' => array('modules/Tooltip.js', 'modules/Popover.js')
	),
	'tabs' => array(
		'title' => 'Tabs',
		'css' => array('ui/button.css', 'ui/button-group.css', 'ui/effects/button-group.css', 'modules/tabs.css', 'modules/effects/tabs.css'),
		'js' => array('modules/Tabs.js')
	),
	'tooltip' => array(
		'title' => 'Tooltip',
		'css' => array('ui/button.css', 'modules/tooltip.css'),
		'js' => array('modules/Tooltip.js')
	),
);

$themes = array(
	'none' => array(
		'title' => 'None'
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
	'info' => 'Information',
	'warning' => 'Warning',
	'success' => 'Success',
	'error' => 'Error'
);

$visuals = array(
	'visual-gloss' => 'Gloss',
	'visual-reflect' => 'Reflect',
	'visual-glare' => 'Glare',
	'visual-popout' => 'Popout'
);

// Detect theme and asset
$assetKey = 'base';
$themeKey = 'tomorrow-night';

if (isset($_GET['asset']) && isset($assets[$_GET['asset']])) {
	$assetKey = $_GET['asset'];
}

if (isset($_GET['theme']) && isset($themes[$_GET['theme']])) {
	$themeKey = $_GET['theme'];
}

$asset = $assets[$assetKey];
$theme = $themes[$themeKey]; ?>

<!DOCTYPE html>
<html>
<head>
	<title>Titon - Toolkit - <?php echo $asset['title']; ?></title>
	<link href="css/test.css" rel="stylesheet" type="text/css">

	<?php $minFile = dirname(__DIR__) . '/build/titon-1.0.0.min.css';

	if (file_exists($minFile)) { ?>
		<link href="../build/titon-1.0.0.min.css" rel="stylesheet" type="text/css">

	<?php } else if (!empty($asset['css'])) { ?>
		<link href="../src/css/base.css" rel="stylesheet" type="text/css">
		<link href="../src/css/effects/visual.css" rel="stylesheet" type="text/css">

		<?php foreach ((array) $asset['css'] as $css) { ?>
			<link href="../src/css/<?php echo $css; ?>" rel="stylesheet" type="text/css">
		<?php }
	}

	if (!empty($theme['css'])) {
		foreach ((array) $theme['css'] as $css) { ?>
			<link href="../src/css/<?php echo $css; ?>" rel="stylesheet" type="text/css">
		<?php }
	} ?>

	<script type="text/javascript" src="js/mootools-core-1.4.5.js"></script>
	<script type="text/javascript" src="js/mootools-more-1.4.0.1.js"></script>

	<?php $minFile = dirname(__DIR__) . '/build/titon-1.0.0.min.js';

	if (file_exists($minFile)) { ?>
		<script type="text/javascript" src="../build/titon-1.0.0.min.js"></script>

	<?php } else if (!empty($asset['js'])) { ?>
		<script type="text/javascript" src="../src/js/Titon.js"></script>
		<script type="text/javascript" src="../src/js/Module.js"></script>

		<?php foreach ((array) $asset['js'] as $js) { ?>
			<script type="text/javascript" src="../src/js/<?php echo $js; ?>"></script>
		<?php }
	} ?>
</head>
<body class="<?php echo $themeKey; ?>">
	<?php include sprintf('%s.php', $assetKey); ?>

	<form action="" method="get" class="test-switcher">
		<select name="asset">
			<option value="">-- Module --</option>
			<?php foreach ($assets as $key => $value) { ?>
				<option value="<?php echo $key; ?>"<?php if ($key === $assetKey) echo ' selected="selected"'; ?>><?php echo $value['title']; ?></option>
			<?php } ?>
		</select>

		<select name="theme">
			<option value="">-- Theme --</option>
			<?php foreach ($themes as $key => $value) { ?>
				<option value="<?php echo $key; ?>"<?php if ($key === $themeKey) echo ' selected="selected"'; ?>><?php echo $value['title']; ?></option>
			<?php } ?>
		</select>

		<button type="submit">GO</button>
	</form>
</body>
</html>