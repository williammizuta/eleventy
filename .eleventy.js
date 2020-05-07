module.exports = function(eleventyConfig) {

    //[{"url":"/posts/post-01/","title":"post-01"},{"url":"/posts/post-02/","title":"post-02"},{"url":"/about/","title":"about"}]
    eleventyConfig.addCollection('documents', function(collection) {
        return collection.getFilteredByGlob('**/*.md').map(function(document) {
            return {
                'folders': document.url.split('/').filter(folder => !!folder),
                'name': document.fileSlug,
                'url': document.url,
            };
        }).reduce(function(menu, document) {
            const foldersLength = document.folders.length;
            document.folders.forEach(function(folder, i) {
                if ((i + 1) === foldersLength) {
                    menu[folder] = {
                        name: document.name,
                        url: document.url
                    };
                }
            });


            // if (document.folders.length == 1) {
                
            // } else if (menu[document.folders[0]] && menu[document.folders[0]].children) {
            //     menu[document.folders[0]].children.push({
            //         name: document.folders[1],
            //         url: document.url,
            //     });
            // } else {
            //     menu[document.folders[0]] = {
            //         name: document.folders[0],
            //         children: [{
            //             name: document.folders[1],
            //             url: document.url,
            //         }],
            //     };
            // }
            return menu;
        }, {});
    });

    eleventyConfig.addCollection('menu', function(collection) {
        return [{
            'name': 'posts',
            'children': [
                {
                    'name': 'post-01',
                    'url': '/posts/post-01',
                },
                {
                    'name': 'post-02',
                    'url': '/posts/post-02',
                }
            ]
        }, {
            'name': 'about',
            'url': '/about',
        }];
    });

    const categoryToHTML = function(category) {
        if(category) {
            return `<nav>
                ${category.reduce(function(html, item) {
                    return html + `
                    <li>
                        ${item.url ? ('<a href="' + item.url + '">' + item.name + '</a>') : item.name}
                        ${categoryToHTML(item.children)}
                    </li>`;
                }, '')}
            </nav>`
        }
        return '';
    };

    eleventyConfig.addShortcode('menu', function(menu, currentPage) {
        return `<aside>
            ${categoryToHTML(menu)}
        </aside>`
    });

};
