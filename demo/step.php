<nav class="steps <?php echo value('size'); ?>" role="navigation" aria-label="Stepped Navigation">
    <ol class="round">
        <?php
        $max = value('count', 5);
        $complete = value('complete', 3);

        for ($i = 1; $i <= $max; $i++) { ?>
            <li<?php if ($i <= $complete) echo ' class="is-complete"'; ?>>
                <a href="?component=step&theme=<?= value('theme', 'titon'); ?>&vendor=jquery1&size=<?= value('size'); ?>&count=<?= $max; ?>&complete=<?= $i; ?>"
                   class="step">
                    Step <?= $i; ?>
                </a>
            </li>
        <?php } ?>
    </ol>
</nav>