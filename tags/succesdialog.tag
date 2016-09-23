<succesdialog>
  <dialog id="succesdialog">{ message }<br><br><a class="my2 btn--link btn--blue" onclick={ closeDialog }>Close</a></dialog>

  <script>
    this.openDialog = '';
    var that = this;
    this.on('watch.succesdialog.message', function (message) {
      that.update({
        message: message
      });
      document.getElementById('succesdialog').showModal();
    });

    closeDialog() {
      document.getElementById('succesdialog').close();
    }
  </script>
</succesdialog>

