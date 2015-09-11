/* global GovRight:true, _ */
'use strict';
(function () {

  // We use Mustache-style template tags, even though we're
  // lodashing it.
  _.templateSettings = {
    evaluate:    /\{\{(.+?)\}\}/g,
    interpolate: /\{\{=(.+?)\}\}/g,
    escape:      /\{\{-(.+?)\}\}/g
  };
})();

var GovRight = GovRight || {};

GovRight.getRemote = function (path, cb) {
  var request = new XMLHttpRequest();
  request.open('GET', GovRight.SiteConfig.corpusUrl+path, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      cb(JSON.parse(request.responseText));
    } else {
      console.log('getRemote failure: ', request.responseText);
    }
  };

  request.onerror = function() {
    console.log('getRemote failure: ', request.responseText);
  };

  request.send();
};

GovRight.getTemplate = function (id) {
  if (document.getElementById('corpus-'+ id)!== null && !(GovRight.templates[id] && GovRight.templates[id].runtime)) {
    GovRight.templates[id] = _.template(document.getElementById('corpus-'+id).innerHTML);
    GovRight.templates[id].runtime = true;
  }

  return GovRight.templates[id];
};

GovRight.callTemplate = function (id, params) {
  var tmpl = GovRight.getTemplate(id);

  if (!tmpl) {
    console.error('Unknown template:',id);
    return;
  }

  return tmpl(params);
};

GovRight.truncateString = function (str, maxLength) {
  maxLength = maxLength || 200;
  var suffix = '...';

  if (str && str.length > maxLength) {
    str = str.substring(0, maxLength + 1);
    str = str.substring(0, Math.min(str.length, str.lastIndexOf(' ')));
    str = str + suffix;
  }

  return str || '';
};

GovRight.formatDate = function (date, format) {
  var addZero = function (i) {
    return (i < 10 ? '0' : '') + i;
  };

  return format.replace(/yyyy|MM|dd|HH|mm/g, function (a) {
    switch (a) {
      case 'yyyy':
        return date.getFullYear();
      case 'MM':
        return addZero(date.getMonth() + 1);
      case 'mm':
        return addZero(date.getMinutes());
      case 'dd':
        return addZero(date.getDate());
      case 'HH':
        return addZero(date.getHours());
    }
  });
};