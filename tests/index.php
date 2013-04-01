<?php

$assets = array(
	'base' => array(
		'title' => 'Base',
	),
	'alert' => array(
		'title' => 'Alert',
		'css' => 'ui/alert.css'
	),
	'button' => array(
		'title' => 'Button',
		'css' => array('ui/button.css', 'ui/effects/button.css')
	),
	'button-group' => array(
		'title' => 'Button Group',
		'css' => array('ui/button.css', 'ui/button-group.css', 'ui/effects/button-group.css')
	),
	'icon' => array(
		'title' => 'Icon',
		'css' => array('ui/button.css', 'ui/icon.css')
	),
	'label-badge' => array(
		'title' => 'Label & Badge',
		'css' => array('ui/label-badge.css', 'ui/effects/label.css')
	),
	'pagination' => array(
		'title' => 'Pagination',
		'css' => array('ui/button.css', 'ui/pagination.css', 'ui/effects/pagination.css')
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
	<link href="../src/css/base.css" rel="stylesheet" type="text/css">
	<?php
	if (!empty($asset['css'])) {
		foreach ((array) $asset['css'] as $css) { ?>
			<link href="../src/css/<?php echo $css; ?>" rel="stylesheet" type="text/css">
		<?php }
	}
	if (!empty($theme['css'])) {
		foreach ((array) $theme['css'] as $css) { ?>
			<link href="../src/css/<?php echo $css; ?>" rel="stylesheet" type="text/css">
		<?php }
	} ?>
</head>
<body>
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