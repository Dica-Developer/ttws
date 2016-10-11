<stravapublicuploadcheckbox>

  <label class="c-label c-label--xlarge">Upload activities to Strava as public.</label>
  <input type="checkbox" class="a-toogle c-choice--xlarge" checked={ public } onclick={ setUploadState }></input>

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

