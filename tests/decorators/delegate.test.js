import delegate from '../../src/decorators/delegate';

class DelegateStub {
  constructor() {
    this.count = 0;
  }

  @delegate('.foo')
  handleClass() {
    this.count += 1;
  }

  @delegate('#b')
  handleID() {
    this.count += 1;
  }
}

describe('decorators/delegate()', () => {
  let obj = null;
  let element = null;

  beforeEach(() => {
    obj = new DelegateStub();
    element = document.createElement('div');
    element.innerHTML = '<span id="a" class="foo"></span><span id="b"></span><span id="c" class="foo"></span>';
  });

  it('should trigger the function if the selector was clicked', () => {
    element.addEventListener('click', obj.handleClass.bind(obj));

    expect(obj.count).toBe(0);

    for (let i = 0; i < element.children.length; i += 1) {
      element.children[i].click();
    }

    expect(obj.count).toBe(2);
  });

  it('should trigger if the selector is an ID', () => {
    element.addEventListener('click', obj.handleID.bind(obj));

    expect(obj.count).toBe(0);

    for (let i = 0; i < element.children.length; i += 1) {
      element.children[i].click();
    }

    expect(obj.count).toBe(1);
  });
});
