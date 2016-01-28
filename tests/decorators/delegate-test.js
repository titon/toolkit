import delegate from '../../src/decorators/delegate';

class DelegateStub {
    constructor() {
        this.count = 0;
    }

    @delegate('.foo')
    handleClass() {
        this.count++;
    }

    @delegate('#b')
    handleID() {
        this.count++;
    }
}

describe('decorators/delegate()', () => {
    let obj = null,
        element = null;

    beforeEach(() => {
        obj = new DelegateStub();
        element = createElement('div', {
            html: '<span id="a" class="foo"></span><span id="b"></span><span id="c" class="foo"></span>'
        });
    });

    afterEach(() => {
        element.cleanup();
    });

    it('should trigger the function if the selector was clicked', () => {
        element.addEventListener('click', obj.handleClass.bind(obj));

        expect(obj.count).toBe(0);

        for (let i = 0; i < element.children.length; i++) {
            element.children[i].click();
        }

        expect(obj.count).toBe(2);
    });

    it('should trigger if the selector is an ID', () => {
        element.addEventListener('click', obj.handleID.bind(obj));

        expect(obj.count).toBe(0);

        for (let i = 0; i < element.children.length; i++) {
            element.children[i].click();
        }

        expect(obj.count).toBe(1);
    });
});
