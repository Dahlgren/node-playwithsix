var ProgressBarImpl = require('progress');

var ProgressBar = function () {
  this.currentMod = null;
  this.progressBar = null;
};

ProgressBar.prototype.update = function (progress) {
  if (progress.mod !== this.currentMod) {
    this.currentMod = progress.mod;
    if (this.progressBar !== null) {
      this.progressBar.terminate();
    }

    this.progressBar = new ProgressBarImpl(' ' + progress.mod + ' [:bar] :percent', {
      clear: false,
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: progress.size
    });
  }
  this.progressBar.update(progress.completed / progress.size);
};

module.exports = ProgressBar;
