<h1>Badge</h1>

<div class="example">
	<?php foreach ($types as $type => $typeTitle) { ?>
		<span class="badge <?php echo $type; ?>"><?php echo rand(0, 500); ?></span>
	<?php } ?>
</div>

<h1>Label</h1>

<div class="example">
	<?php foreach ($types as $type => $typeTitle) { ?>
		<span class="label <?php echo $type; ?>"><?php echo $typeTitle; ?></span>
	<?php } ?>
</div>

<h1>Label: Effects</h1>

<div class="example">
	<h2>Arrows</h2>

	<div class="row">
		<?php foreach ($types as $type => $typeTitle) { ?>
			<span class="label label-left <?php echo $type; ?>"><?php echo $typeTitle; ?></span>
		<?php } ?>
	</div>

	<div class="row">
		<?php foreach ($types as $type => $typeTitle) { ?>
			<span class="label label-right <?php echo $type; ?>"><?php echo $typeTitle; ?></span>
		<?php } ?>
	</div>
</div>