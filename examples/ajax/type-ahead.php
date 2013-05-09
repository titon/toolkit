<?php $funcs = get_defined_functions();
echo json_encode($funcs['internal']);