<icon>
  <i class={ className } style="font-size: 10em;"></i>

  <script>
    this.className = "fa fa-clock-o";

    var that = this;
    this.on('watch.progress.start', function() {
      that.update({
        className: "fa fa-clock-o fa-spin"
      });
    });

    this.on('watch.progress.stop', function() {
      that.update({
        className: "fa fa-clock-o"
      });
    });
  </script>
</icon>

