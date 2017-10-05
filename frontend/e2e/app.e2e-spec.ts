import { BoardsFrontendPage } from './app.po';

describe('boards-frontend App', function() {
  let page: BoardsFrontendPage;

  beforeEach(() => {
    page = new BoardsFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
