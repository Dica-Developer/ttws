<successdialog>
  <dialog id="successdialog">{ message }<br><br><a class="my2 btn--link btn--blue" onclick={ closeDialog }>Close</a></dialog>

  <script>
    this.openDialog = '';
    var that = this;
    this.on('watch.successdialog.message', function (message) {
      that.update({
        message: message
      });
      document.getElementById('successdialog').showModal();
    });

    closeDialog() {
      document.getElementById('successdialog').close();
    }
  </script>
</successdialog>

