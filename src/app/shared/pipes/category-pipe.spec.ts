import { CategoryPipe } from './category-pipe';

fdescribe('CategoryPipe', () => {
  let pipe: CategoryPipe;

  beforeEach(() => {
    pipe = new CategoryPipe();
  });

  it('should return code for Front-End category', () => {
    expect(pipe.transform("Front-End")).toBe('code');
    expect(pipe.transform("front-end")).toBe('code');
    expect(pipe.transform("FRONT-END")).toBe('code');
    expect(pipe.transform("FRONT-END")).toBe('code');
    expect(pipe.transform("   Front-End   ")).toBe('code');
  });

  it('should return computer for Back-End category', () => {
    expect(pipe.transform("Back-End")).toBe('computer');
  });

  it('should return error for unknown categories', () => {
    expect(pipe.transform("Database")).toBe('error');
  })

});
