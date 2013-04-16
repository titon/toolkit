<h1>LazyLoad</h1>

<div class="example">
	<?php $c = time(); ?>

	<div class="col align-center">
		<h2>Default</h2>

		<?php for ($x = 0; $x <= 10; $x++) { ?>

			<div class="lazy-load-0 lazy-load">
				<img src="http://lorempixel.com/200/200/?c=<?php echo $c; ?>">
			</div>

		<?php $c++; } ?>
	</div>

	<div class="col align-center">
		<h2>Fade</h2>

		<?php for ($x = 0; $x <= 10; $x++) { ?>

			<div class="lazy-load-1 lazy-load">
				<img src="http://lorempixel.com/200/200/?c=<?php echo $c; ?>">
			</div>

		<?php $c++; } ?>
	</div>

	<div class="col align-center">
		<h2>Force Load</h2>

		<?php for ($x = 0; $x <= 10; $x++) { ?>

			<div class="lazy-load-2 lazy-load">
				<img src="http://lorempixel.com/200/200/?c=<?php echo $c; ?>">
			</div>

		<?php $c++; } ?>
	</div>

	<span class="clear"></span>
</div>

<script type="text/javascript">
	Titon.LazyLoad.factory('.lazy-load-0');
	Titon.LazyLoad.factory('.lazy-load-1', { fade: 2000 });
	Titon.LazyLoad.factory('.lazy-load-2', { forceLoad: true, delay: 5000 });
</script>