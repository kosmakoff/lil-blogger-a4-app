import { LilBloggerA4AppPage } from './app.po';

describe('lil-blogger-a4-app App', () => {
  let page: LilBloggerA4AppPage;

  beforeEach(() => {
    page = new LilBloggerA4AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
