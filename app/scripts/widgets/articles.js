/* global GovRight, _ */
'use strict';
(function () {
  var containers = document.getElementsByTagName('corpus-articles');
  if (containers.length > 0) {
    _.each(containers, function (container) {
      var locale = container.getAttribute('locale') || container.getAttribute('data-locale');
      var slugChain = (container.getAttribute('slug') || '').split(':', 2);
      var limit = (container.getAttribute('limit') || 10);
      var sort = (container.getAttribute('sort') || 'top-commented');
      var lawSlug = slugChain[0];
      var discussionSlug = slugChain[1];

      if (!lawSlug) {
        return;
      }

      var resourceUrl = '/Discussions/findOne?filter[where][lawSlug]=' + lawSlug;
      if (discussionSlug) {
        resourceUrl += '&filter[where][slug]=' + discussionSlug;
      }

      GovRight.getRemote(resourceUrl, function (discussion) {
        if (!discussion) {
          return;
        }

        if (!discussion.locales[locale]) {
          locale = discussion.defaultLocale;
        }

        if (discussion.locales[locale]) {
          Object.keys(discussion.locales[locale]).forEach(function (k) {
            discussion[k] = discussion.locales[locale][k];
          });
        }

        var articlesUrl = '/Discussions/' + discussion.id + '/search/versions?sort=' + sort + '&limit=' + limit;
        GovRight.getRemote(articlesUrl, function (articles) {
          _.each(articles, function(article) {
            ['title', 'text'].forEach(function (k){
              article[k] = article.locales[locale][k];
            });
          });
          container.outerHTML = GovRight.callTemplate('articles', {discussion: discussion, locale: locale, articles: articles });
        });
      });
    });
  }
})();
