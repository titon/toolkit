<?php
$slides = array(
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	'Nullam auctor gravida diam. Donec eget magna nunc.',
	'Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula.',
	'Suspendisse interdum malesuada mi non dictum.',
	'Quisque cursus imperdiet lorem, in posuere quam eleifend non.'
); ?>

<div class="example-header">Carousel</div>

<div class="example">
	<p>Images provided by <a href="http://lorempixel.com">lorempixel.com</a>. Icons provided by <a href="http://fortawesome.github.io/Font-Awesome">FontAwesome</a> (chrome only).</p>

	<div class="carousel" id="carousel-1">
		<ul class="carousel-slides">
			<?php for ($i = 0; $i < 5; $i++) { ?>
				<li>
					<img class="image" src="http://lorempixel.com/640/360/?c=<?php echo $i; ?>">

					<div class="caption">
						<h2><a href="">Slide #<?php echo $i; ?></a></h2>
						<?php echo $slides[$i]; ?>
					</div>
				</li>
			<?php } ?>
		</ul>

		<ol class="carousel-tabs">
			<?php for ($i = 0; $i < 5; $i++) { ?>
				<li><a href="javascript:;"<?php if (!$i) echo ' class="is-active"'; ?>></a></li>
			<?php } ?>
		</ol>

		<a href="javascript:;" class="carousel-prev">
			<span class="icon-chevron-sign-left"></span>
		</a>

		<a href="javascript:;" class="carousel-next">
			<span class="icon-chevron-sign-right"></span>
		</a>
	</div>

	<p>Do a slide animation upward instead. No index tabs.</p>

	<div class="carousel" id="carousel-2">
		<ul class="carousel-slides">
			<?php for ($i = 0; $i < 5; $i++) { ?>
				<li>
					<img class="image" src="http://lorempixel.com/640/360/?c=<?php echo $i; ?>">

					<div class="caption">
						<h2><a href="">Slide #<?php echo $i; ?></a></h2>
						<?php echo $slides[$i]; ?>
					</div>
				</li>
			<?php } ?>
		</ul>

		<a href="javascript:;" class="carousel-prev">
			<span class="icon-chevron-sign-left"></span>
		</a>

		<a href="javascript:;" class="carousel-next">
			<span class="icon-chevron-sign-right"></span>
		</a>
	</div>

	<p>Do a fade animation instead. No next or previous.</p>

	<div class="carousel" id="carousel-3">
		<ul class="carousel-slides">
			<?php for ($i = 0; $i < 5; $i++) { ?>
				<li>
					<img class="image" src="http://lorempixel.com/640/360/?c=<?php echo $i; ?>">

					<div class="caption">
						<h2><a href="">Slide #<?php echo $i; ?></a></h2>
						<?php echo $slides[$i]; ?>
					</div>
				</li>
			<?php } ?>
		</ul>

		<ol class="carousel-tabs">
			<?php for ($i = 0; $i < 5; $i++) { ?>
				<li><a href="javascript:;"<?php if (!$i) echo ' class="is-active"'; ?>></a></li>
			<?php } ?>
		</ol>
	</div>

	<p>Should disable with a single image.</p>

	<div class="carousel" id="carousel-4">
		<ul class="carousel-slides">
			<li>
				<img class="image" src="http://lorempixel.com/640/360/?c=1">

				<div class="caption">
					<h2><a href="">Slide #1</a></h2>
					<?php echo $slides[1]; ?>
				</div>
			</li>
		</ul>

		<ol class="carousel-tabs">
			<li><a href="javascript:;"<?php if (!$i) echo ' class="is-active"'; ?>></a></li>
		</ol>

		<a href="javascript:;" class="carousel-prev">
			<span class="icon-chevron-sign-left"></span>
		</a>

		<a href="javascript:;" class="carousel-next">
			<span class="icon-chevron-sign-right"></span>
		</a>
	</div>

	<p>Will not auto-rotate. No captions.</p>

	<div class="carousel" id="carousel-5">
		<ul class="carousel-slides">
			<?php for ($i = 0; $i < 5; $i++) { ?>
				<li>
					<img class="image" src="http://lorempixel.com/640/360/?c=<?php echo $i; ?>">
				</li>
			<?php } ?>
		</ul>

		<ol class="carousel-tabs">
			<?php for ($i = 0; $i < 5; $i++) { ?>
				<li><a href="javascript:;"<?php if (!$i) echo ' class="is-active"'; ?>></a></li>
			<?php } ?>
		</ol>

		<a href="javascript:;" class="carousel-prev">
			<span class="icon-chevron-sign-left"></span>
		</a>

		<a href="javascript:;" class="carousel-next">
			<span class="icon-chevron-sign-right"></span>
		</a>
	</div>
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		Titon.Carousel.factory('#carousel-1');
		Titon.Carousel.factory('#carousel-2', { animation: 'slide-up' });
		Titon.Carousel.factory('#carousel-3', { animation: 'fade' });
		Titon.Carousel.factory('#carousel-4');
		Titon.Carousel.factory('#carousel-5', { autoCycle: false });
	});
</script>