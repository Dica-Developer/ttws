<watchversion>
  <pre><code>{ version }</code></pre>

  <script>
    this.version = 'Not yet retrieved.'

    var that = this;
    this.on('watch.version.success', function(result) {
      that.update({
        version: result
      });
    });

    this.on('watch.version.error', function(result) {
      that.update({
        version: result
      });
    });
  </script>
</watchversion>

