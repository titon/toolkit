<div class="example-header">Pagination</div>

<?php
$typeClasses = array_keys($types);

$t = 0;
foreach ($shapes as $shape => $shapeTitle) { ?>

	<div class="example">
		<div class="example-title"><?php echo $shapeTitle; ?></div>

		<?php foreach ($sizes as $size => $sizeTitle) { ?>

			<nav class="pagination <?php echo $shape . ' ' . $size; ?>">
				<ul>
					<li class="is-active"><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>">Previous</a></li>
					<?php for ($i = 0; $i <= rand(2, 10); $i++) { ?>
						<li><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>"><?php echo $i; ?></a></li>
					<?php } ?>
					<li class="is-disabled"><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>">Next</a></li>
				</ul>
			</nav>

		<?php } ?>

	</div>

	<?php $t++;
} ?>

<div class="example-header">Pagination: Effects</div>

<?php $t = 0;
foreach ($shapes as $shape => $shapeTitle) { ?>

	<div class="example">
		<div class="example-title"><?php echo $shapeTitle; ?>: Grouped</div>

		<?php foreach ($sizes as $size => $sizeTitle) { ?>

			<nav class="pagination pagination--grouped <?php echo $shape . ' ' . $size; ?>">
				<ul>
					<li class="is-active"><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>">Previous</a></li>
					<?php for ($i = 0; $i <= rand(2, 10); $i++) { ?>
						<li><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>"><?php echo $i; ?></a></li>
					<?php } ?>
					<li class="is-disabled"><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>">Next</a></li>
				</ul>
			</nav>

		<?php } ?>

	</div>

	<?php $t++;
} ?>