import React, { PropTypes } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Collapse from '../../src/motions/Collapse';

class CollapseController extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    expanded: PropTypes.bool,
  };

  static defaultProps = {
    expanded: true,
  };

  constructor(props) {
    super();

    this.state = {
      expanded: props.expanded,
    };
  }

  toggle = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  render() {
    return (
      <div>
        <button type="button" onClick={this.toggle}>Toggle</button>

        <div style={{ marginTop: 15 }}>
          {this.props.children(this.state.expanded)}
        </div>
      </div>
    );
  }
}

storiesOf('motions/Collapse', module)
  .add('default (expanded)', () => (
    <CollapseController>
      {expanded => (
        <Collapse expanded={expanded} onRest={action('onRest')}>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus vehicula varius viverra. Suspendisse vitae risus tellus.
            Curabitur eu felis eget massa finibus vulputate quis vel tellus.
            Mauris et maximus felis, ac pretium nisl. Mauris viverra,
            sapien a ornare molestie, orci ante rhoncus eros,
            quis tincidunt justo odio eget sapien. Vivamus fermentum eros ante,
            non euismod arcu tristique ac. Nunc ac nisl sollicitudin,
            consequat mauris at, iaculis lorem. Vivamus congue mauris non lorem sodales,
            commodo fringilla ipsum aliquam. Donec congue lorem dui,
            ut bibendum nunc pretium ut. Curabitur in dolor lorem.
            Cras nec aliquam risus, vitae sollicitudin dui.
          </div>
        </Collapse>
      )}
    </CollapseController>
  ))
  .add('default (not expanded)', () => (
    <CollapseController expanded={false}>
      {expanded => (
        <Collapse expanded={expanded} onRest={action('onRest')}>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus vehicula varius viverra. Suspendisse vitae risus tellus.
            Curabitur eu felis eget massa finibus vulputate quis vel tellus.
            Mauris et maximus felis, ac pretium nisl. Mauris viverra,
            sapien a ornare molestie, orci ante rhoncus eros,
            quis tincidunt justo odio eget sapien. Vivamus fermentum eros ante,
            non euismod arcu tristique ac. Nunc ac nisl sollicitudin,
            consequat mauris at, iaculis lorem. Vivamus congue mauris non lorem sodales,
            commodo fringilla ipsum aliquam. Donec congue lorem dui,
            ut bibendum nunc pretium ut. Curabitur in dolor lorem.
            Cras nec aliquam risus, vitae sollicitudin dui.
          </div>
        </Collapse>
      )}
    </CollapseController>
  ))
  .add('padding on content', () => (
    <CollapseController>
      {expanded => (
        <Collapse expanded={expanded} onRest={action('onRest')}>
          <div style={{ paddingTop: 50, paddingBottom: 50 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus vehicula varius viverra. Suspendisse vitae risus tellus.
            Curabitur eu felis eget massa finibus vulputate quis vel tellus.
            Mauris et maximus felis, ac pretium nisl. Mauris viverra,
            sapien a ornare molestie, orci ante rhoncus eros,
            quis tincidunt justo odio eget sapien. Vivamus fermentum eros ante,
            non euismod arcu tristique ac. Nunc ac nisl sollicitudin,
            consequat mauris at, iaculis lorem. Vivamus congue mauris non lorem sodales,
            commodo fringilla ipsum aliquam. Donec congue lorem dui,
            ut bibendum nunc pretium ut. Curabitur in dolor lorem.
            Cras nec aliquam risus, vitae sollicitudin dui.
          </div>
        </Collapse>
      )}
    </CollapseController>
  ))
  .add('very large content', () => (
    <CollapseController>
      {expanded => (
        <Collapse expanded={expanded} onRest={action('onRest')}>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus vehicula varius viverra. Suspendisse vitae risus tellus.
            Curabitur eu felis eget massa finibus vulputate quis vel tellus.
            Mauris et maximus felis, ac pretium nisl. Mauris viverra,
            sapien a ornare molestie, orci ante rhoncus eros,
            quis tincidunt justo odio eget sapien. Vivamus fermentum eros ante,
            non euismod arcu tristique ac. Nunc ac nisl sollicitudin,
            consequat mauris at, iaculis lorem. Vivamus congue mauris non lorem sodales,
            commodo fringilla ipsum aliquam. Donec congue lorem dui,
            ut bibendum nunc pretium ut. Curabitur in dolor lorem.
            Cras nec aliquam risus, vitae sollicitudin dui.
            <br /><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus vehicula varius viverra. Suspendisse vitae risus tellus.
            Curabitur eu felis eget massa finibus vulputate quis vel tellus.
            Mauris et maximus felis, ac pretium nisl. Mauris viverra,
            sapien a ornare molestie, orci ante rhoncus eros,
            quis tincidunt justo odio eget sapien. Vivamus fermentum eros ante,
            non euismod arcu tristique ac. Nunc ac nisl sollicitudin,
            consequat mauris at, iaculis lorem. Vivamus congue mauris non lorem sodales,
            commodo fringilla ipsum aliquam. Donec congue lorem dui,
            ut bibendum nunc pretium ut. Curabitur in dolor lorem.
            Cras nec aliquam risus, vitae sollicitudin dui.
            <br /><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus vehicula varius viverra. Suspendisse vitae risus tellus.
            Curabitur eu felis eget massa finibus vulputate quis vel tellus.
            Mauris et maximus felis, ac pretium nisl. Mauris viverra,
            sapien a ornare molestie, orci ante rhoncus eros,
            quis tincidunt justo odio eget sapien. Vivamus fermentum eros ante,
            non euismod arcu tristique ac. Nunc ac nisl sollicitudin,
            consequat mauris at, iaculis lorem. Vivamus congue mauris non lorem sodales,
            commodo fringilla ipsum aliquam. Donec congue lorem dui,
            ut bibendum nunc pretium ut. Curabitur in dolor lorem.
            Cras nec aliquam risus, vitae sollicitudin dui.
          </div>
        </Collapse>
      )}
    </CollapseController>
  ))
  .add('horizontal collapsing', () => (
    <CollapseController>
      {expanded => (
        <Collapse expanded={expanded} direction="width" onRest={action('onRest')}>
          <div style={{ width: 250 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus vehicula varius viverra. Suspendisse vitae risus tellus.
            Curabitur eu felis eget massa finibus vulputate quis vel tellus.
            Mauris et maximus felis, ac pretium nisl. Mauris viverra,
            sapien a ornare molestie, orci ante rhoncus eros,
            quis tincidunt justo odio eget sapien. Vivamus fermentum eros ante,
            non euismod arcu tristique ac. Nunc ac nisl sollicitudin,
            consequat mauris at, iaculis lorem. Vivamus congue mauris non lorem sodales,
            commodo fringilla ipsum aliquam. Donec congue lorem dui,
            ut bibendum nunc pretium ut. Curabitur in dolor lorem.
            Cras nec aliquam risus, vitae sollicitudin dui.
          </div>
        </Collapse>
      )}
    </CollapseController>
  ))
  .add('fixed at height 50px', () => (
    <CollapseController>
      {expanded => (
        <Collapse expanded={expanded} fixedAt={50} direction="height" onRest={action('onRest')}>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus vehicula varius viverra. Suspendisse vitae risus tellus.
            Curabitur eu felis eget massa finibus vulputate quis vel tellus.
            Mauris et maximus felis, ac pretium nisl. Mauris viverra,
            sapien a ornare molestie, orci ante rhoncus eros,
            quis tincidunt justo odio eget sapien. Vivamus fermentum eros ante,
            non euismod arcu tristique ac. Nunc ac nisl sollicitudin,
            consequat mauris at, iaculis lorem. Vivamus congue mauris non lorem sodales,
            commodo fringilla ipsum aliquam. Donec congue lorem dui,
            ut bibendum nunc pretium ut. Curabitur in dolor lorem.
            Cras nec aliquam risus, vitae sollicitudin dui.
          </div>
        </Collapse>
      )}
    </CollapseController>
  ))
  .add('fixed at width 50px', () => (
    <CollapseController>
      {expanded => (
        <Collapse expanded={expanded} fixedAt={50} direction="width" onRest={action('onRest')}>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus vehicula varius viverra. Suspendisse vitae risus tellus.
            Curabitur eu felis eget massa finibus vulputate quis vel tellus.
            Mauris et maximus felis, ac pretium nisl. Mauris viverra,
            sapien a ornare molestie, orci ante rhoncus eros,
            quis tincidunt justo odio eget sapien. Vivamus fermentum eros ante,
            non euismod arcu tristique ac. Nunc ac nisl sollicitudin,
            consequat mauris at, iaculis lorem. Vivamus congue mauris non lorem sodales,
            commodo fringilla ipsum aliquam. Donec congue lorem dui,
            ut bibendum nunc pretium ut. Curabitur in dolor lorem.
            Cras nec aliquam risus, vitae sollicitudin dui.
          </div>
        </Collapse>
      )}
    </CollapseController>
  ));
