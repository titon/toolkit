<h1>Pagination</h1>

<?php
$typeClasses = array_keys($types);

$t = 0;
foreach ($shapes as $shape => $shapeTitle) { ?>

	<div class="example">
		<h2><?php echo $shapeTitle; ?></h2>

		<?php foreach ($sizes as $size => $sizeTitle) { ?>

			<nav class="pagination <?php echo $shape . ' ' . $size; ?>">
				<ul>
					<li class="active"><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>">Previous</a></li>
					<?php for ($i = 0; $i <= rand(2, 10); $i++) { ?>
						<li><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>"><?php echo $i; ?></a></li>
					<?php } ?>
					<li class="disabled"><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>">Next</a></li>
				</ul>
			</nav>

		<?php } ?>

	</div>

	<?php $t++;
} ?>

<h1>Pagination: Effects</h1>

<?php $t = 0;
foreach ($shapes as $shape => $shapeTitle) { ?>

	<div class="example">
		<h2><?php echo $shapeTitle; ?>: Grouped</h2>

		<?php foreach ($sizes as $size => $sizeTitle) { ?>

			<nav class="pagination pagination-grouped <?php echo $shape . ' ' . $size; ?>">
				<ul>
					<li class="active"><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>">Previous</a></li>
					<?php for ($i = 0; $i <= rand(2, 10); $i++) { ?>
						<li><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>"><?php echo $i; ?></a></li>
					<?php } ?>
					<li class="disabled"><a href="javascript:;" class="button <?php echo $typeClasses[$t]; ?>">Next</a></li>
				</ul>
			</nav>

		<?php } ?>

	</div>

	<?php $t++;
} ?>