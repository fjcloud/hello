export default class BlogNavigation {
  constructor({
    zeroMdUrl = '',
    postsPath = '',
    backButtonElement = null,
    zeroMdElement = null,
  } = {}) {
    this.zeroMdUrl = zeroMdUrl;
    this.backButtonElement = backButtonElement || document.createElement('button');
    this.zeroMdElement = zeroMdElement || document.createElement('zero-md');
    this.setup();
  }
  
  navigateTo(newSrc) {
    this.zeroMdElement.setAttribute('src', newSrc);
    this.zeroMdElement.render();
  }
  
  translateCleanURL(url) {
    const cleanURLRegex = /^\/(.+)$/;
    const match = url.match(cleanURLRegex);
    return match ? `${this.zeroMdUrl}${match[1]}` : null;
  }
  
  setup() {
    this.backButtonElement.textContent = 'Back';
    this.backButtonElement.style.display = 'none';
    document.body.appendChild(this.backButtonElement);
    this.zeroMdElement.setAttribute('src', this.zeroMdUrl);
    document.body.appendChild(this.zeroMdElement);
    
    this.backButtonElement.addEventListener('click', this.goBack.bind(this));
    this.zeroMdElement.addEventListener('zero-md-rendered', this.handleRender.bind(this));
    
    page('*', (ctx) => {
      const translatedURL = this.translateCleanURL(ctx.path);
      if (translatedURL) {
        this.navigateTo(translatedURL);
        this.backButtonElement.style.display = 'block';
      } else if (ctx.path !== '/') {
        page.redirect(`/posts${ctx.path}`);
      }
    });

    page();
  }
  
  handleRender() {
    const nodes = this.zeroMdElement.shadowRoot.querySelectorAll('a[href$=".md"]');
    nodes.forEach((node) => {
      node.addEventListener('click', (e) => {
        e.preventDefault();
        const newSrc = node.href.replace(/https:\/\/raw\.githubusercontent\.com\/fjcloud\/hello\/main\/(.+)\.md/, '/posts/$1');
        this.navigateTo(newSrc);
        this.backButtonElement.style.display = 'block';
        page(newSrc);
      });
    });
  }
  
  goBack() {
    page('/');
    this.backButtonElement.style.display = 'none';
    window.location.reload();
  }
}
