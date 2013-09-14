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

<div class="example-header">
	<button type="button" onclick="appendItem();" class="float-right">Append Item</button>
	<button type="button" onclick="prependItem();" class="float-right">Prepend Item</button>
	<button type="button" onclick="removeItem();" class="float-right">Remove Item</button>

	Matrix
</div>

<div class="example">
	<div id="matrix">
		<?php for ($i = 0, $x = 0; $i <= 25; $i++) {
			if ($x >= count($images)) {
				$x = 0;
			} ?>

			<div class="matrix-grid">
				<img src="http://lorempixel.com/<?php echo $images[$x][0]; ?>/<?php echo $images[$x][1]; ?>/">
			</div>

		<?php $x++;
		} ?>
	</div>
</div>

<script type="text/javascript">
	function appendItem() {
		newItem('append');
	}

	function prependItem() {
		newItem('prepend');
	}

	function removeItem() {
		var items = $$('.matrix-grid').shuffle();

		$('matrix').matrix().remove(items[0]);
	}

	function newItem(where) {
		var w = 200, //Number.random(200, 600),
			h = Number.random(200, 600),
			i = new Image();

		i.src = 'http://lorempixel.com/' + w + '/' + h + '/';
		i.onload = function() {
			$('matrix').matrix()[where](new Element('div.matrix-grid').grab(i));
		};
	}

	window.addEvent('domready', function() {
		setTimeout(function() {
			$('matrix').matrix({
				animation: 'fade',
				selector: '.matrix-grid'
			});
		}, 1000); // Wait for images to load
	});
</script>