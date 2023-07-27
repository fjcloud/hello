import BlogNavigation from './js/md-blog.js';

document.addEventListener('DOMContentLoaded', () => {
    new BlogNavigation({
        zeroMdUrl: 'https://raw.githubusercontent.com/fjcloud/hello/main/index.md',
        postsPath: '/posts/',
    });
});
