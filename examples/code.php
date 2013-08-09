<div class="example-header">Code</div>

<div class="example">
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dapibus tempor risus, a ultricies libero posuere ut. Proin vitae enim fermentum, vulputate justo id, imperdiet nunc. Curabitur pellentesque convallis lectus a porta. Quisque tristique lectus sem, vel lacinia ipsum bibendum a. Phasellus et mauris volutpat augue tempor convallis. Aliquam metus dolor, imperdiet non volutpat nec, molestie sed felis. Etiam orci ipsum, venenatis nec magna nec, porttitor aliquet est. Vivamus id tincidunt dui, in vestibulum enim. Maecenas convallis interdum nibh, vitae tristique tellus adipiscing id. Phasellus rutrum diam in condimentum convallis.</p>

	<pre><code>&lt;div class="titon-debug"&gt;
	&lt;div class="debug-head"&gt;
		&lt;abbr title="&lt;?php echo $file; ?&gt;" class="debug-file"&gt;
			&lt;?php echo self::parseFile($file) . ':'; ?&gt;&lt;!--
			--&gt;&lt;span class="debug-line"&gt;&lt;?php echo $line; ?&gt;&lt;/span&gt;
		&lt;/abbr&gt;
	&lt;/div&gt;

	&lt;?php foreach ($vars as $var) { ?&gt;
		&lt;div class="debug-output"&gt;
			&lt;?php if (isset($dump)) {
				echo self::_renderTemplate('table', array('value' =&gt; $var));
			} else { ?&gt;
				&lt;pre&gt;&lt;code&gt;&lt;?php echo \Titon\esc(print_r($var, true)); ?&gt;&lt;/code&gt;&lt;/pre&gt;
			&lt;?php } ?&gt;
		&lt;/div&gt;
	&lt;?php } ?&gt;
&lt;/div&gt;</code></pre>

	<p>With scrollable modifier.</p>

	<pre class="code--scrollable"><code>/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
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
</div>

<div class="example">
	<div class="example-title">Inline</div>

	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. <code>Inline Code</code>
		Aliquam dapibus tempor risus, a ultricies libero posuere ut. <samp>Sample Text</samp>
		Proin vitae enim fermentum, vulputate justo id. <kbd>esc</kbd>
		Curabitur pellentesque convallis lectus a porta. <var>Variable</var>
	</p>
</div>