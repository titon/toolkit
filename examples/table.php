<?php
$funcs = get_defined_functions();
$total = count($funcs) - 1; ?>

<div class="table-responsive">
    <table class="table <?php echo value('modifier'); ?>">
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
            <?php for ($i = 0; $i <= value('count', 25); $i++) {
                if ($i != 0 && $i % 10 == 0) { ?>
                    <tr class="table-divider">
                        <td colspan="6">Divider</td>
                    </tr>
                <?php } else { ?>
                    <tr>
                        <td>Lorem ipsum dolor sit amet</td>
                        <td><?php echo $funcs['internal'][rand(0, $total)]; ?></td>
                        <td><a href="">Some random link</a></td>
                        <td><?php echo $funcs['internal'][rand(0, $total)]; ?></td>
                        <td><?php echo $funcs['internal'][rand(0, $total)]; ?></td>
                        <td><?php echo date('Y-m-d H:i:s'); ?></td>
                    </tr>
                <?php }
            } ?>
        </tbody>
    </table>
</div>