/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Titon from 'Titon';
import Module from 'Module';
import Element from 'Element';
import ElementCollection from 'ElementCollection';

import Component from 'Component';
import EmbeddedComponent from 'EmbeddedComponent';
import RenderedComponent from 'RenderedComponent';
import ContainerComponent from 'ContainerComponent';
import Accordion from 'components/Accordion';

import Event from 'events/Event';
import Swipe from 'events/Swipe';
import ClickOut from 'events/ClickOut';
import HorizontalResize from 'events/HorizontalResize';
import VerticalResize from 'events/VerticalResize';

import once from 'extensions/event/once';
import swipe from 'extensions/event/swipe';
import delegate from 'extensions/event/delegate';
import clickOut from 'extensions/event/clickOut';
import transitionEnd from 'extensions/event/transitionEnd';
import bem from 'extensions/utility/bem';

Titon.Module = Module;
Titon.Element = Element;
Titon.ElementCollection = ElementCollection;

// Behaviors

// Components
Titon.Component = Component;
Titon.EmbeddedComponent = EmbeddedComponent;
Titon.RenderedComponent = RenderedComponent;
Titon.ContainerComponent = ContainerComponent;
Titon.Accordion = Accordion;

// Events
Titon.Event = Event;
Titon.Event.once = once;
Titon.Event.swipe = swipe;
Titon.Event.delegate = delegate;
Titon.Event.clickOut = clickOut;
Titon.Event.transitionEnd = transitionEnd;
Titon.Swipe = Swipe;
Titon.ClickOut = ClickOut;
Titon.HorizontalResize = HorizontalResize;
Titon.VerticalResize = VerticalResize;

// Other
Titon.bem = bem;
