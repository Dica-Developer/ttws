<stravapublicuploadcheckbox>

  <label class="c-toggle c-toggle--error u-super">
    <input type="checkbox" checked={ public } onclick={ setUploadState }>
    <div class="c-toggle__track">
      <div class="c-toggle__handle"></div>
    </div>
    Upload activities to Strava as public.
  </label>

  <script>
    this.public = "";
    let that = this;
    setUploadState(event) {
      if (event.currentTarget.checked) {
        this.opts.bus.trigger('ttws.strava.upload.public');
      } else {
        this.opts.bus.trigger('ttws.strava.upload.private');
      }
    }
    this.opts.bus.on('ttws.strava.upload.public.already', () => {
      that.update({public: "checked"});
    });
    this.opts.bus.on('ttws.strava.upload.private.already', () => {
      that.update({public: ""});
    });
    this.opts.bus.on('ttws.strava.upload.public.success', () => {
      that.update({public: "checked"});
    });
    this.opts.bus.on('ttws.strava.upload.private.success', () => {
      that.update({public: ""});
    });
  </script>
</stravapublicuploadcheckbox>

