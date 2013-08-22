<div class="example-header">Button Group</div>

<div class="example">
	<p>Anchors.</p>

	<div class="button-group round">
		<a href="javascript:;" class="button">Button</a>
		<a href="javascript:;" class="button">Button</a>
		<a href="javascript:;" class="button">Button</a>
	</div>

	<div class="button-group round">
		<a href="javascript:;" class="button">Single Button</a>
	</div>

	<div class="button-group round">
		<a href="javascript:;" class="button last">Button With Dropdown</a>

		<ul class="dropdown">
			<li><a href="javascript:;">Action</a></li>
		</ul>
	</div>

	<p>Buttons.</p>

	<div class="button-group round">
		<button type="button" class="button">Button</button>
		<button type="button" class="button">Button</button>
		<button type="button" class="button">Button</button>
	</div>

	<div class="button-group round">
		<button type="button" class="button">Single Button</button>
	</div>

	<div class="button-group round">
		<ul class="dropdown">
			<li><a href="javascript:;">Action</a></li>
		</ul>

		<button type="button" class="button first">Button With Dropdown</button>
	</div>

	<p>Anchors and buttons within an unordered list.</p>

	<ul class="button-group round">
		<li><button type="button" class="button">Button</button></li>
		<li><a href="javascript:;" class="button">Button</a></li>
		<li><button type="button" class="button">Button</button></li>
	</ul>

	<ul class="button-group round">
		<li><button type="button" class="button">Button</button></li>
	</ul>
</div>

<?php unset($shapes['oval']);

$effects = array(
	'button-group--vertical' => 'Vertical'
);

foreach ($shapes as $shape => $shapeTitle) { ?>

	<div class="example">
		<div class="example-title"><?php echo $shapeTitle; ?></div>

		<?php foreach ($types as $type => $typeTitle) { ?>

			<div class="row">

				<?php $count = 2;
				foreach ($sizes as $size => $sizeTitle) {
					$class = $shape . ' ' . $size;
					$title = $shapeTitle . ' ' . $sizeTitle; ?>

					<div class="button-group <?php echo $class; ?>">
						<?php for ($i = 0; $i <= $count; $i++) { ?>
							<a href="javascript:;" class="button <?php echo $type; ?>">Button <?php echo $i; ?></a>
						<?php } ?>
					</div>

				<?php $count--;
				} ?>

			</div>

		<?php } ?>
	</div>

<?php }

// New shape
$shapes['skew-reverse'] = 'Skew Reverse';

foreach ($effects as $effect => $effectTitle) { ?>

	<div class="example">
		<div class="example-title"><?php echo $effectTitle; ?></div>

		<?php
		$t = 0;
		$typeClasses = array_keys($types);

		foreach ($shapes as $shape => $shapeTitle) {
			$classes = array($effect, $shape);

			foreach ($sizes as $size => $sizeTitle) {
				$class = implode(' ', $classes) . ' ' . $size;
				$title = $shapeTitle . ' ' . $sizeTitle;
				$count = rand(2, 8); ?>

				<div class="button-group <?php echo $class; ?>">
					<?php for ($i = 0; $i <= $count; $i++) { ?>
						<button type="button" class="button <?php echo $typeClasses[$t]; ?>"><?php echo $i; ?></button>
					<?php } ?>
				</div>

			<?php }
			$t++;
		} ?>

	</div>

<?php } ?>

<div class="example">
	<div class="example-title">Justified (flex only)</div>

	<div class="button-group button-group--justified">
		<a href="" class="button">Button 1</a>
		<a href="" class="button">Button 2</a>
		<a href="" class="button">Button 3</a>
		<a href="" class="button">Button 4</a>
		<a href="" class="button">Button 5</a>
	</div>
</div>