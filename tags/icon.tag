<icon>
  <i class={ className } style="font-size: 10em;"></i>

  <script>
    this.className = "fa fa-clock-o";

    var that = this;
    this.opts.bus.on('watch.progress.start', function() {
      that.update({
        className: "fa fa-clock-o fa-spin"
      });
    });

    this.opts.bus.on('watch.progress.stop', function() {
      that.update({
        className: "fa fa-clock-o"
      });
    });
  </script>
</icon>

