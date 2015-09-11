/* global GovRight, _ */
'use strict';
(function () {
  var containers = document.getElementsByTagName('corpus-discussions');
  if (containers.length > 0) {
    _.each(containers, function (container) {
      var user = container.getAttribute('user') || container.getAttribute('data-user');
      var locale = container.getAttribute('locale') || container.getAttribute('data-locale');

      var url = '/Discussions?filter[include]=stats';
      if (user) {
        url += '&filter[where][userId]='+user;
      }

      GovRight.getRemote(url, function (discussions) {
        discussions.forEach(function (discussion) {
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

            if(discussion.overview) {
                discussion.overview = GovRight.truncateString(discussion.overview);
            }
          container.innerHTML += GovRight.callTemplate('discussion', {discussion: discussion, locale: locale });
        });
      });
    });
  }
})();
