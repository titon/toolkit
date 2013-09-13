<?php
$text = array(
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula.',
	'Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum.',
	'Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio.',
	'Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.',
	'Suspendisse interdum malesuada mi non dictum. Quisque cursus imperdiet lorem, in posuere quam eleifend non.',
	'Integer eros libero, lacinia nec fringilla non, vulputate vitae felis.',
	'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis ligula sapien, tristique sit amet tempor id, iaculis vel nisl.',
	'Maecenas rhoncus facilisis lacus non blandit. Nam quis erat arcu. Suspendisse facilisis venenatis elit, et posuere leo dictum a. Integer at tellus leo, sit amet malesuada orci.',
	'Proin placerat nulla vitae diam mattis at volutpat risus pellentesque.',
	'Sed malesuada scelerisque semper. Mauris imperdiet nibh eros. Fusce quis vulputate enim. Proin a enim sit amet purus interdum ultricies. In hac habitasse platea dictumst.',
	'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
	'Ut a magna sem, nec placerat nibh. Proin quis metus nunc, at vulputate erat. Etiam quis diam est. Nullam quam turpis, condimentum et iaculis in, pharetra sed enim.'
);

shuffle($text); ?>

<div class="example-header">Masonry</div>

<div class="example">
	<div class="masonry-wrapper" id="masonry">
		<?php for ($i = 0, $x = 0; $i <= 25; $i++) {
			if ($x >= count($text)) {
				$x = 0;
			} ?>

			<div class="masonry-item w<?php echo ($i % 5); ?>">
				<?php echo $text[$x]; ?>
				<?php echo $text[$x]; ?>
			</div>

		<?php $x++;
		} ?>
	</div>
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		$('masonry').masonry();
	});
</script>