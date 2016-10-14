<filelist>
    <table class="c-table c-table--striped">
      <thead class="c-table__head">
        <tr class="c-table__row c-table__row--heading">
          <th class="c-table__cell">
            File
          </th>
          <th class="c-table__cell">
            Time
          </th>
          <th class="c-table__cell">
            Action
          </th>
        </tr>
      </thead>
      <tbody class="c-table__body">
        <tr class="c-table__row" data-path={ path } each={ files }>
          <td class="c-table__cell">{ name }</td>
          <td class="c-table__cell">{ mtime }</td>
          <td class="c-table__cell u-super"><i title="Upload activity" class="fa fa-upload fa-2" aria-hidden="true" style="cursor: pointer;" onclick={ upload }></i><i title="Upload in progress" id={ name } style="display:none;" class="fa fa-circle-o-notch fa-spin fa-2 fa-fw"></i>
</td>
        </tr>
      </tbody>
    </table>
  </div> 

  <script>
    const fs = require('fs');
    var that = this;

    this.files=[];

    upload(e) {
      this.opts.bus.trigger('local.activities.convert', e.item);
    }

    function compareByTime(fileA, fileB) {
      let result = 0;
      if (fileA.mtime > fileB.mtime) {
        result = -1;
      } else if (fileA.mtime < fileB.mtime) {
        result = 1;
      }
      return result;
    }

    function collectFiles(files, root) {
      let result = new Array();
      for (index in files) {
        let status = fs.statSync(root +  files[index]);
        if (status.isDirectory()) {
          let rootDir = root + files[index] + '/';
          Array.prototype.push.apply(result, collectFiles(fs.readdirSync(rootDir), rootDir));
        } else {
          result.push({name: files[index], path: root + files[index], mtime: status.mtime });
        }
      }
      result.sort(compareByTime);
      return result;
    }

    function findTtbinFiles(directory) {
      fs.readdir(directory, function (error, files) {
        if (null !== error) {
          that.opts.bus.trigger('watch.successdialog.message', 'Error on reading local activities: ' + error);
        } else {
          let result = collectFiles(files, directory);
          that.update({
            files: result
          });
        }
      });
    }

    this.opts.bus.on('watch.activities.upload.progress.start', function(item) {
      document.getElementById(item.name).style.display = 'block';
    });

    this.opts.bus.on('watch.activities.upload.progress.stop', function(item) {
      document.getElementById(item.name).style.display = 'none';
    });

    this.opts.bus.on('watch.activities.update', function() {
      findTtbinFiles('/home/ms/.ttws/');
    });

    findTtbinFiles('/home/ms/.ttws/');
  </script>
</filelist>

