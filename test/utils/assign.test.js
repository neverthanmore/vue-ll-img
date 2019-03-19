import assign from '../../utils/assign';

describe('Test assign function for object', () => {
  it('check if params is not Object', () => {
    expect(assign(1, 2, 3)).toBeFalsy();
  });

  it('check when params length lt 2', () => {
    expect(assign({})).toBeFalsy();
  });

  it('check normal assign', () => {
    expect(assign({ a: 1, b: 2 }, { a: 2, b: '' })).toEqual({ a: 2, b: 2 });
  });
});
