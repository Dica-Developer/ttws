<updatebutton>

  <span class="c-button-group">
    <button class="c-button c-button--block c-button--super" onclick={ connectWithStrava }>Connect with strava for uploading results</button>
  </span>

  <script>
    connectWithStrava() {
      this.opts.bus.trigger('ttws.connect.strava');
    }
  </script>
</updatebutton>

