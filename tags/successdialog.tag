<successdialog>
  <div class="c-overlay a-overlay" style="display: none;"></div>
  <div class="c-modal a-modal" style="display: none;>
    <header class="c-modal__header">
      <button type="button" class="c-button c-button--close">×</button>
    </header>

    <div class="c-modal__body">
      { message }
    </div>

    <footer class="c-modal__footer">
      <button onclick={ closeDialog } type="button" class="c-button c-button--primary">Close</button>
    </footer>
  </div>

  <script>
    this.openDialog = '';
    var that = this;
    this.opts.bus.on('watch.successdialog.message', function (message) {
      that.update({
        message: message
      });
      document.querySelector('.a-modal').style.display = 'block';
      document.querySelector('.a-overlay').style.display = 'block';
    });

    closeDialog() {
      document.querySelector('.a-modal').style.display = 'none';
      document.querySelector('.a-overlay').style.display = 'none';
    }
  </script>
</successdialog>

