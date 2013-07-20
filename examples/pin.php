<h1>Pin</h1>

<div class="example pin-right">
	<div class="pin" id="pin-right">
		This div should stay positioned at the top right of the page, regardless of window scroll.<br><br>
		It will also stay contained within the parent.
	</div>

	<?php for ($i = 0; $i <= 10; $i++) { ?>
		<p id="t<?php echo $i; ?>">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
	<?php } ?>
</div>

<div class="example pin-left">
	<div class="pin" id="pin-left1">
		This div should stay positioned at the top right of the page, regardless of window scroll.<br><br>
		It will also stay contained within the parent.
	</div>

	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
</div>

<div class="example pin-left">
	<div class="pin" id="pin-left2">
		This div should stay positioned at the top right of the page, regardless of window scroll.<br><br>
		It will also stay contained within the parent.
	</div>

	<?php for ($i = 0; $i <= 10; $i++) { ?>
		<p id="b<?php echo $i; ?>">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
	<?php } ?>
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		Titon.Pin.factory('pin-right');
		Titon.Pin.factory('pin-left1', { location: 'left' });
		Titon.Pin.factory($('pin-left2'), { location: 'left', xOffset: 10 });
		Titon.Pin.factory('pin-missing');
	});
</script>