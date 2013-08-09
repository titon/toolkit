<div class="example-header">Button</div>

<?php
$sizes['is-disabled'] = 'Disabled';
$sizes['is-active'] = 'Active';

foreach ($shapes as $shape => $shapeTitle) { ?>

	<div class="example">
		<div class="example-title"><?php echo $shapeTitle; ?></div>

		<?php foreach ($types as $type => $typeTitle) {
			$classes = array($type, $shape); ?>

			<div class="row">

				<?php foreach ($sizes as $size => $sizeTitle) {
					$class = implode(' ', $classes) . ' ' . $size;
					$title = $shapeTitle . ' ' . $sizeTitle; ?>

					<button type="button" class="button <?php echo $class; ?>"><?php echo $title; ?></button>
					<a href="javascript:;" class="button <?php echo $class; ?>"><?php echo $title; ?></a>

				<?php } ?>

			</div>

		<?php } ?>
	</div>

<?php } ?>

<div class="example-header">Button: Effects</div>

<?php foreach ($visuals as $visual => $visualTitle) { ?>

	<div class="example">
		<div class="example-title"><?php echo $visualTitle; ?></div>

		<?php
		$i = 0;
		$typeClasses = array_keys($types);

		foreach ($shapes as $shape => $shapeTitle) {
			$classes = array($visual, $shape, $typeClasses[$i]); ?>

			<div class="row">

				<?php foreach ($sizes as $size => $sizeTitle) {
					$class = implode(' ', $classes) . ' ' . $size;
					$title = $shapeTitle . ' ' . $sizeTitle; ?>

					<button type="button" class="button <?php echo $class; ?>"><?php echo $title; ?></button>
					<a href="javascript:;" class="button <?php echo $class; ?>"><?php echo $title; ?></a>

				<?php } ?>

			</div>

			<?php $i++;
		} ?>

	</div>

<?php } ?>
