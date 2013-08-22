<?php
$funcs = get_defined_functions();
$count = count($funcs['internal']) - 1; ?>

<div class="example-header">Table</div>

<div class="example">
	<p>Default styling.</p>

	<table class="table">
		<thead>
			<tr>
				<th>Heading</th>
				<th>Heading</th>
				<th>Heading</th>
				<th>Heading</th>
				<th>Heading</th>
				<th>Heading</th>
			</tr>
		</thead>
		<tbody>
			<?php for ($i = 0; $i <= 25; $i++) {
				if ($i == 10) { ?>
					<tr class="divider">
						<td colspan="6">Divider</td>
					</tr>
				<?php } else { ?>
					<tr>
						<td>Lorem ipsum dolor sit amet</td>
						<td><?php echo $funcs['internal'][rand(0, $count)]; ?></td>
						<td><a href="">Some random link</a></td>
						<td><?php echo $funcs['internal'][rand(0, $count)]; ?></td>
						<td><?php echo $funcs['internal'][rand(0, $count)]; ?></td>
						<td><?php echo date('Y-m-d H:i:s'); ?></td>
					</tr>
				<?php }
			} ?>
		</tbody>
	</table>
</div>

<div class="example">
	<p>With hover and compact modifiers.</p>

	<table class="table table--hover table--compact">
		<thead>
			<tr>
				<th>Heading</th>
				<th>Heading</th>
				<th>Heading</th>
				<th>Heading</th>
				<th>Heading</th>
				<th>Heading</th>
			</tr>
		</thead>
		<tbody>
			<?php for ($i = 0; $i <= 25; $i++) {
				if ($i == 10) { ?>
					<tr class="divider">
						<td colspan="6">Divider</td>
					</tr>
				<?php } else { ?>
					<tr>
						<td>Lorem ipsum dolor sit amet</td>
						<td><?php echo $funcs['internal'][rand(0, $count)]; ?></td>
						<td><a href="">Some random link</a></td>
						<td><?php echo $funcs['internal'][rand(0, $count)]; ?></td>
						<td><?php echo $funcs['internal'][rand(0, $count)]; ?></td>
						<td><?php echo date('Y-m-d H:i:s'); ?></td>
					</tr>
				<?php }
			} ?>
		</tbody>
	</table>
</div>

<div class="example">
	<p>With sortable modifier.</p>

	<table class="table table--sortable">
		<thead>
			<tr>
				<th><a href="">Heading</a></th>
				<th><a href="">Heading</a></th>
				<th><a href="">Heading</a></th>
				<th><a href="">Heading</a></th>
				<th><a href="">Heading</a></th>
				<th><a href="">Heading</a></th>
			</tr>
		</thead>
		<tbody>
			<?php for ($i = 0; $i <= 10; $i++) { ?>
				<tr>
					<td>Lorem ipsum dolor sit amet</td>
					<td><?php echo $funcs['internal'][rand(0, $count)]; ?></td>
					<td><a href="">Some random link</a></td>
					<td><?php echo $funcs['internal'][rand(0, $count)]; ?></td>
					<td><?php echo $funcs['internal'][rand(0, $count)]; ?></td>
					<td><?php echo date('Y-m-d H:i:s'); ?></td>
				</tr>
			<?php } ?>
		</tbody>
	</table>
</div>