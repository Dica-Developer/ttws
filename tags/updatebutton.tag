<updatebutton>

  <a class="btn btn--blue" onclick={ updateFirmware }>Update firmware</a>
  <a class="btn btn--blue" onclick={ updateGps }>Update GPSQuickFix</a>
  <a class="btn btn--blue" onclick={ updateTime }>Update time</a>
  <a class="btn btn--green" onclick={ downloadActivities }>Get latest activities</a>

  <script>
    updateFirmware() {
      this.opts.bus.trigger('watch.update.firmware');
    }
    updateGps() {
      this.opts.bus.trigger('watch.update.gps');
    }
    updateTime() {
      this.opts.bus.trigger('watch.update.time');
    }
    downloadActivities() {
      this.opts.bus.trigger('watch.download.activities');
    }
  </script>
</updatebutton>

