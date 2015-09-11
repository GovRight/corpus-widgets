/* global GovRight, _ */
'use strict';
(function () {
  var containers = document.getElementsByTagName('corpus-discussion');
  if (containers.length > 0) {
    _.each(containers, function (container) {
      var locale = container.getAttribute('locale') || container.getAttribute('data-locale');
      var slugChain = (container.getAttribute('slug') || '').split(':', 2);
      var lawSlug = slugChain[0];
      var discussionSlug = slugChain[1];

      if (!lawSlug) {
        return;
      }

      var resourceUrl = '/Discussions/findOne?filter[include]=stats&filter[where][lawSlug]='+lawSlug;
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

        if (discussion.stats && discussion.stats.length > 0) {
          discussion.stats = discussion.stats[0];
        } else {
          discussion.stats = null;
        }

        container.outerHTML = GovRight.callTemplate('discussion', {discussion: discussion, locale: locale });
      });
    });
  }
})();
