<stravaauthbutton>

  <button class="c-button c-button--block c-button--super c-button--error" onclick={ connectWithStrava } style="white-space: normal;">Connect with strava for uploading results</button>

  <script>
    connectWithStrava() {
      this.opts.bus.trigger('ttws.connect.strava');
    }
  </script>
</stravaauthbutton>

