<filelist>
    <table class="c-table c-table--striped">
      <thead class="c-table__head">
        <tr class="c-table__row c-table__row--heading">
          <th class="c-table__cell">
            File
          </th>
          <th class="c-table__cell">
            Action
          </th>
        </tr>
      </thead>
      <tbody class="c-table__body">
        <tr class="c-table__row" each={ files }>
          <td class="c-table__cell">{ name }</td>
          <td class="c-table__cell">&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </div> 

  <script>
    const fs = require('fs');
    var that = this;

    this.files=[];

    function collectFiles(files, root) {
      let result = new Array();
      for (index in files) {
        if (fs.statSync(root +  files[index]).isDirectory()) {
          let rootDir = root + files[index] + '/';
          Array.prototype.push.apply(result, collectFiles(fs.readdirSync(rootDir), rootDir));
        } else {
          result.push({name: files[index], path: root + files[index]});
        }
      }
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

    this.opts.bus.on('watch.activities.update', function() {
      findTtbinFiles('/home/ms/.ttws/');
    });

    findTtbinFiles('/home/ms/.ttws/');
  </script>
</filelist>

