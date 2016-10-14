<successdialog>
  <div class="c-overlay" style="display: none;"></div>
  <div class="o-modal u-highest" style="display: none;>
    <div class="c-card">
      <header class="c-card__header">
        <button type="button" class="c-button c-button--close">×</button>
      </header>

      <div class="c-card__body">
        { message }
      </div>

      <footer class="c-card__footer">
        <button onclick={ closeDialog } type="button" class="c-button c-button--brand">Close</button>
      </footer>
  </div>

  <script>
    this.openDialog = '';
    var that = this;
    this.opts.bus.on('watch.successdialog.message', function (message) {
      that.update({
        message: message
      });
      document.querySelector('.o-modal').style.display = 'block';
      document.querySelector('.c-overlay').style.display = 'block';
    });

    closeDialog() {
      document.querySelector('.o-modal').style.display = 'none';
      document.querySelector('.c-overlay').style.display = 'none';
    }
  </script>
</successdialog>

