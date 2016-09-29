<updatebutton>

  <span class="c-button-group">
    <button class="c-button" onclick={ updateFirmware }>Update firmware</button>
    <button class="c-button" onclick={ updateGps }>Update GPSQuickFix</button>
    <button class="c-button" onclick={ updateTime }>Update time</button>
    <button id="getlatestactivitiesbutton" class="c-button c-button--primary" onclick={ downloadActivities }><span style="text-decoration: underline;">G</span>et latest activities</button>
  </span>

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
    Mousetrap.bind(['alt+g'], function() {
      document.getElementById('getlatestactivitiesbutton').click();
      return false;
    });
  </script>
</updatebutton>

