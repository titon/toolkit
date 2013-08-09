<div class="example-header">Badge</div>

<div class="example">
	<?php foreach ($types as $type => $typeTitle) { ?>
		<span class="badge <?php echo $type; ?>"><?php echo rand(0, 500); ?></span>
	<?php } ?>
</div>

<div class="example-header">Label</div>

<div class="example">
	<?php foreach ($types as $type => $typeTitle) { ?>
		<span class="label <?php echo $type; ?>"><?php echo $typeTitle; ?></span>
	<?php } ?>
</div>

<div class="example">
	<div class="example-title">Arrows</div>

	<div class="row">
		<?php foreach ($types as $type => $typeTitle) { ?>
			<span class="label label--left <?php echo $type; ?>"><?php echo $typeTitle; ?></span>
		<?php } ?>
	</div>

	<div class="row">
		<?php foreach ($types as $type => $typeTitle) { ?>
			<span class="label label--right <?php echo $type; ?>"><?php echo $typeTitle; ?></span>
		<?php } ?>
	</div>
</div>