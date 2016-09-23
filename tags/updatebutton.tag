<updatebutton>

  <a class="btn--link btn--blue" onclick={ updateFirmware }>Update firmware</a>
  <a class="btn--link btn--blue" onclick={ updateGps }>Update GPSQuickFix</a>
  <a class="btn--link btn--blue" onclick={ updateTime }>Update time</a>

  <script>
    updateFirmware() {
      this.trigger('watch.update.firmware');
    }
    updateGps() {
      this.trigger('watch.update.gps');
    }
    updateTime() {
      this.trigger('watch.update.time');
    }
  </script>
</updatebutton>

