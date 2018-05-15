import SldStyleParser from './SldStyleParser';

it('SldStyleParser is defined', () => {
  expect(SldStyleParser).toBeDefined();
});

describe('SldStyleParser implements StyleParser', () => {

  it('readStyle is defined', () => {
    const styleParser = new SldStyleParser();
    expect(styleParser.readStyle).toBeDefined();
  });
  it('writeStyle is defined', () => {
    const styleParser = new SldStyleParser();
    expect(styleParser.writeStyle).toBeDefined();
  });
});
