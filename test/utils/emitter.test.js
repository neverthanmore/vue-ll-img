import Emitter from '../../utils/emitter';

jest.mock('../../utils/emitter');

descripe('Test emitter for eventBus function', () => {
  it('We can check if the consumer called the class constructor', () => {
    const eventBus = new Emitter();
    expect(Emitter).toHaveBeenCalledTimes(1);
  });
});
