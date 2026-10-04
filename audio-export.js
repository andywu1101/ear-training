/* 免費版：停用版空殼（導出為贊助者專屬） */
(function (global) {
  'use strict';
  function nope() { return Promise.reject(new Error('export disabled')); }
  global.AudioExport = { exportEvents: nope, encodeMp3: nope, deliver: nope,
                         fileName: function () { return ''; } };
})(window);
