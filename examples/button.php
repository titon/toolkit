<h1>Button</h1>

<?php
$sizes['disabled'] = 'Disabled';
$sizes['active'] = 'Active';

foreach ($shapes as $shape => $shapeTitle) { ?>

	<div class="example">
		<h2><?php echo $shapeTitle; ?></h2>

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

<h1>Button: Effects</h1>

<?php foreach ($visuals as $visual => $visualTitle) { ?>

	<div class="example">
		<h2><?php echo $visualTitle; ?></h2>

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
