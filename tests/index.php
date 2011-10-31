<!DOCTYPE html>
<html>
	<head>
		<title>Titon Test</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<script src="mootools-core-1.4.1.js"></script>
		<script src="mootools-more-1.4.0.1.js"></script>
		<script src="../src/Titon.js"></script>
		<script src="../src/Tooltip.js"></script>
		<script src="../src/Flyout.js"></script>
		<style>
			body { padding: 100px; }
			.titon-tooltip,
			.flyout-menu { position: absolute; background: rgba(0, 0, 0, .70); color: #fff; margin: 0; padding: 5px; display: none; border-radius: 5px; }
			.flyout-menu { list-style: none; width: 200px; }
			.flyout-menu li { position: relative; }
			.flyout-menu li a { display: block; padding: 2px; }
			.flyout-menu li .flyout-menu { top: 0; left: 200px; }
		</style>
	</head>
	<body>
		<div id="content" style="display: none">DOM</div>
		
		<span data-tooltip="TEXT" id="test" title="Title">Text Tooltip</span>
		<br /><br />
		<span data-tooltip="#content" data-tooltip-config="position:mouse;">DOM Tooltip</span>
		<br /><br />
		<span data-tooltip="ajax.php" data-tooltip-config="isAjax:true">AJAX Tooltip</span>
		
		<div class="breadcrumbs">
			<a href="http://titon/js/tests/index.php">ROOT</a> &raquo; 
			<?php for ($i = 0; $i < 5; $i++) { ?>
				<a href="http://titon/js/tests/index.php?i=<?php echo $i; ?>">Crumb <?php echo $i; ?></a> &raquo; 
			<?php } ?>
		</div>
		
		<script>
			window.addEvent('load', function() {
				Titon.Tooltip.factory('[data-tooltip]');
				Titon.Flyout.factory('.breadcrumbs a', 'json.php');
			});
		</script>
	</body>
</html>
