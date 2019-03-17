import Emitter from '../../utils/emitter';

describe('Test emitter for eventBus function', () => {
  it('check $on and $off', () => {
    const eventBus = new Emitter();
    const sum = function(a, b) {
      return a + b;
    };
    eventBus.$on('sum', sum);
    expect(eventBus.$has('sum', sum)).toBeTruthy();
    eventBus.$off('sum', sum);
    expect(eventBus.$has('sum', sum)).not.toBeTruthy();
  });

  it('check $on with $once', () => {
    const eventBus = new Emitter();
    let a, b, c;
    const afn = function(v) {
      a = v;
    };
    const bfn = function(v) {
      b = v;
    };
    const cfn = function(v) {
      c = v;
    };
    eventBus.$on('assign', afn);
    eventBus.$once('assign', bfn);
    eventBus.$on('assign', cfn);
    expect(eventBus._events['assign'].length).toBe(3);
    eventBus.$emit('assign', 10);

    expect(a).toBe(10);
    expect(b).toBe(10);
    expect(c).toBe(10);

    expect(eventBus._events['assign'].length).toBe(2);
    expect(eventBus.$has('assign', bfn)).toBeFalsy();
  });
});
