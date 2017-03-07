import calculateDimensions from '../../src/utility/calculateDimensions';

describe('utility/calculateDimensions()', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.width = '250px';
    element.style.height = '100px';
  });

  describe('width', () => {
    it('returns the outer width', () => {
      processInThread(() => {
        expect(calculateDimensions(element, 'width')).toBe(250);
      });
    });

    it('includes the left and right margin', () => {
      element.style.marginLeft = '15px';
      element.style.marginRight = '10px';

      processInThread(() => {
        expect(calculateDimensions(element, 'width', true)).toBe(275);
      });
    });
  });

  describe('height()', () => {
    it('returns the outer height', () => {
      processInThread(() => {
        expect(calculateDimensions(element, 'height')).toBe(100);
      });
    });

    it('includes the top and bottom margin', () => {
      element.style.marginTop = '15px';
      element.style.marginBottom = '10px';

      processInThread(() => {
        expect(calculateDimensions(element, 'height', true)).toBe(125);
      });
    });
  });
});
