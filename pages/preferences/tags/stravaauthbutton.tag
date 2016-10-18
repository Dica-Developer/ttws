<stravaauthbutton>

  <img onclick={ connectToStrava } class="o-image" src="images/btn_strava_connectwith_orange.svg"></img>
  <label class="c-toggle u-super">
    <input hide={ connected } type="checkbox" disabled="">
    <input show={ connected } type="checkbox" disabled="" checked="">
    <div class="c-toggle__track">
      <div class="c-toggle__handle"></div>
    </div>
    <span hide={ connected }>Disconnected</span>
    <span show={ connected }>Connected</span>
  </label>

  <script>
    this.connected = false;
    let that = this;
    connectToStrava() {
      this.opts.bus.trigger('ttws.connect.strava');
    }
    disconnectFromStrava() {
      this.opts.bus.trigger('ttws.disconnect.strava');
    }
    this.opts.bus.on('ttws.connect.strava.already', () => {
      that.update({connected: true});
    });
    this.opts.bus.on('ttws.connect.strava.success', () => {
      that.update({connected: true});
    });
  </script>
</stravaauthbutton>

