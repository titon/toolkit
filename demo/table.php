<?php
$funcs = get_defined_functions();
$total = count($funcs) - 1;

$classes = array(value('size'));

if (value('hover')) {
    $classes[] = 'has-hover';
}

if (value('striped')) {
    $classes[] = 'is-striped';
}

if (value('sortable')) {
    $classes[] = 'is-sortable';
}

$classes = implode(' ', $classes); ?>

<div class="table-responsive">
    <table class="table <?php echo $classes; ?>">
        <thead>
            <tr>
                <th>
                    <a href="">
                        Heading
                        <span class="sorter asc">
                            <span class="caret-up"></span>
                            <span class="caret-down"></span>
                        </span>
                    </a>
                </th>
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