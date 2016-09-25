<filelist>
  <div class="oflow-y--hidden bg--off-white p2 py2">
    <table class="bg--white">
      <thead>
        <tr>
          <th>
            file
          </th>
          <th>
            action
          </th>
        </tr>
      </thead>
      <tbody>
        <tr each={ files }>
          <td>{ name }</td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </div> 

  <style>
    table {
      width: 100%;
    }
  </style>

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

