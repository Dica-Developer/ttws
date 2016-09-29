<stravaauthbutton>

  <button hide={ connected }  class="c-button c-button--block c-button--super c-button--error" onclick={ connectToStrava } style="white-space: normal;">
    <i class="fa fa-chain-broken" aria-hidden="true"></i>
    Connect to strava for uploading results
  </button>
  <button show={ connected } class="c-button c-button--block c-button--super c-button--error" onclick={ disconnectFromStrava } style="white-space: normal;">
    <i class="fa fa-link" aria-hidden="true"></i>
    Disconnect from strava for uploading results
  </button>

  <script>
    this.connected = false;
    let that = this;
    connectToStrava() {
      this.opts.bus.trigger('ttws.connect.strava');
    }
    disconnectFromStrava() {
      this.opts.bus.trigger('ttws.disconnect.strava');
    }
    this.opts.bus.on('ttws.connect.strava.success', () => {
      that.update({connected: true});
    });
  </script>
</stravaauthbutton>

