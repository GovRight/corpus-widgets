/* global GovRight, _ */
'use strict';
(function () {
  var containers = document.getElementsByTagName('corpus-recent-comments');
  if (containers.length > 0) {
    _.each(containers, function (container) {
      var locale = container.getAttribute('locale') || container.getAttribute('data-locale');
      var slugChain = (container.getAttribute('slug') || '').split(':', 2);
      var limit = (container.getAttribute('limit') || 5);
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

        var commentsUrl = '/Discussions/' + discussion.id + '/search/comments?sort=recent&limit=' + limit;
        GovRight.getRemote(commentsUrl, function (comments) {
          if (comments) {
            comments.forEach(function (comment) {
              comment.created = new Date(comment.created);
            });
          }
          container.outerHTML = GovRight.callTemplate('comments', {discussion: discussion, locale: locale, comments: comments });
        });
      });
    });
  }
})();
