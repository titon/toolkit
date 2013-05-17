<?php
$p1 = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>';
$p2 = '<p>Suspendisse interdum malesuada mi non dictum. Quisque cursus imperdiet lorem, in posuere quam eleifend non. Integer eros libero, lacinia nec fringilla non, vulputate vitae felis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis ligula sapien, tristique sit amet tempor id, iaculis vel nisl. Maecenas rhoncus facilisis lacus non blandit. Nam quis erat arcu. Suspendisse facilisis venenatis elit, et posuere leo dictum a. Integer at tellus leo, sit amet malesuada orci. Proin placerat nulla vitae diam mattis at volutpat risus pellentesque.</p>';
$p3 = '<p>Sed malesuada scelerisque semper. Mauris imperdiet nibh eros. Fusce quis vulputate enim. Proin a enim sit amet purus interdum ultricies. In hac habitasse platea dictumst. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut a magna sem, nec placerat nibh. Proin quis metus nunc, at vulputate erat. Etiam quis diam est. Nullam quam turpis, condimentum et iaculis in, pharetra sed enim.</p>'; ?>

<h1>Accordion</h1>

<div class="example">
	<h2>Default</h2>

	<ul class="accordion acc-1">
		<li>
			<header>One</header>
			<section><?php echo $p1; ?></section>
		</li>
		<li>
			<header>Two</header>
			<section><?php echo $p2; ?></section>
		</li>
		<li>
			<header>Three</header>
			<section><?php echo $p3; ?></section>
		</li>
	</ul>

	<p>Collapsible sections. Multiple visibility.</p>

	<ul class="accordion acc-2">
		<li>
			<header>One</header>
			<section><?php echo $p1; ?></section>
		</li>
		<li>
			<header>Two</header>
			<section><?php echo $p2; ?></section>
		</li>
		<li>
			<header>Three</header>
			<section><?php echo $p3; ?></section>
		</li>
	</ul>

	<p>No slide animation. Toggle with hover.</p>

	<ul class="accordion acc-3">
		<li>
			<header>One</header>
			<section><?php echo $p1; ?></section>
		</li>
		<li>
			<header>Two</header>
			<section><?php echo $p2; ?></section>
		</li>
		<li>
			<header>Three</header>
			<section><?php echo $p3; ?></section>
		</li>
	</ul>
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		Titon.Accordion.factory('.acc-1');
		Titon.Accordion.factory('.acc-2', { multiple: true, collapsible: true });
		Titon.Accordion.factory('.acc-3', { slide: false, mode: 'hover' });
		Titon.Accordion.factory('.acc-missing');
	});
</script>