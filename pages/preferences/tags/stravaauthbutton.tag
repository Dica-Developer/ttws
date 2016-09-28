<stravaauthbutton>

  <button class="c-button c-button--block c-button--super c-button--error" onclick={ connectWithStrava } style="white-space: normal;">
    <i class="fa fa-chain-broken" aria-hidden="true"></i>
    Connect to strava for uploading results
  </button>
  <button class="c-button c-button--block c-button--super c-button--error" onclick={ connectWithStrava } style="white-space: normal;">
    <i class="fa fa-link" aria-hidden="true"></i>
    Disconnect from strava for uploading results
  </button>

  <script>
    this.connected = false;
    let that = this;
    connectWithStrava() {
      this.opts.bus.trigger('ttws.connect.strava');
    }
    this.opts.bus.on('ttws.connect.strava.success', () => {
      that.update({connected: true});
    });
  </script>
</stravaauthbutton>

