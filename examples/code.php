<?php
$class = '';

if ($mod = value('modifier')) {
    $class = 'is-' . $mod;
} ?>

<pre<?php if ($class) echo ' class="' . $class . '"'; ?>><code>/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

namespace Titon\Model;

use Titon\Common\Base;
use Titon\Common\Traits\Attachable;
use Titon\Model\Relation;

class Model extends Base {
    use Attachable;

    protected $_config = [
        'connection' =&gt; 'default',
        'table' =&gt; '',
        'prefix' =&gt; '',
        'primaryKey' =&gt; 'id',
        'displayField' =&gt; ['title', 'name', 'id'],
        'entity' =&gt; 'Titon\Model\Entity'
    ];

    public function addRelation(Relation $relation) {
        $this-&gt;_relations[$relation-&gt;getAlias()] = $relation;

        $this-&gt;attachObject([
            'alias' =&gt; $relation-&gt;getAlias(),
            'class' =&gt; $relation-&gt;getModel(),
            'interface' =&gt; 'Titon\Model\Model'
        ]);

        return $relation;
    }

    public function createTable(array $options = [], $temporary = false) {
        $schema = $this-&gt;getSchema();
        $schema-&gt;addOptions($options + [
            Dialect::ENGINE =&gt; 'InnoDB',
            Dialect::CHARACTER_SET =&gt; $this-&gt;getDriver()-&gt;getEncoding()
        ]);

        return (bool) $this-&gt;query(Query::CREATE_TABLE)
            -&gt;attribute('temporary', $temporary)
            -&gt;schema($schema)
            -&gt;save();
    }

    public function getPrimaryKey() {
        return $this-&gt;cache(__METHOD__, function() {
            $pk = $this-&gt;config-&gt;primaryKey;
            $schema = $this-&gt;getSchema();

            if ($schema-&gt;hasColumn($pk)) {
                return $pk;
            }

            if ($pk = $schema-&gt;getPrimaryKey()) {
                return $pk['columns'][0];
            }

            return 'id';
        });
    }
}</code></pre>

<div class="example-title">Inline</div>

<p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <code>Inline Code</code>
    Aliquam dapibus tempor risus, a ultricies libero posuere ut. <br>
    <samp>Sample Text</samp> Proin vitae enim fermentum, vulputate justo id. <kbd>esc</kbd>
    Curabitur pellentesque convallis lectus a porta. <var>Variable</var>
</p>