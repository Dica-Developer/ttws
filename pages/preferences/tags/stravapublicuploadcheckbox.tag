<stravapublicuploadcheckbox>

  <label class="c-label c-label--xlarge">Upload activities to Strava as public.</label>
  <input type="checkbox" class="a-toogle c-choice--xlarge"></input>

  <script>
    this.public = false;
    let that = this;
    disallowToUploadActivitiesAsPublic() {
      this.opts.bus.trigger('ttws.strava.upload.private');
    }
    allowToUploadActivitiesAsPublic() {
      this.opts.bus.trigger('ttws.strava.upload.public');
    }
    this.opts.bus.on('ttws.strava.upload.public.already', () => {
      that.update({public: true});
    });
    this.opts.bus.on('ttws.strava.upload.private.already', () => {
      that.update({public: false});
    });
    this.opts.bus.on('ttws.strava.upload.public.success', () => {
      that.update({public: true});
    });
    this.opts.bus.on('ttws.strava.upload.private.success', () => {
      that.update({public: false});
    });
  </script>
</stravapublicuploadcheckbox>

