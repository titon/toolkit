<?php
$images = array(
	array(200, 200),
	array(200, 100),
	array(200, 150),
	array(200, 400),
	array(200, 200),
	array(200, 175),
	array(200, 200)
);

shuffle($images); ?>

<div class="example-header">Masonry</div>

<div class="example">
	<div id="masonry">
		<?php for ($i = 0, $x = 0; $i <= 25; $i++) {
			if ($x >= count($images)) {
				$x = 0;
			} ?>

			<div class="masonry-grid">
				<img src="http://lorempixel.com/<?php echo $images[$x][0]; ?>/<?php echo $images[$x][1]; ?>/">
			</div>

		<?php $x++;
		} ?>
	</div>
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		setTimeout(function() {
			$('masonry').masonry({
				selector: '.masonry-grid'
			});
		}, 2000); // Wait for images to load
	});
</script>