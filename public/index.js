/*jshint esversion: 6 */
//client.js
var socket = io();

socket.on('data', function(data) {  
  var len = data.recordset;
  var table = document.getElementById("tabla");
  for(var i in len) {
      var dat = `
        <tr>
            <td class="text-left idalexa">${len[i].alexaId}</td>
            <td class="text-left"><input class="lic" type="text" value="${len[i].llicencia}"></td>
            <td class="text-left">${len[i].palabraClave}</td>
            <td class="text-left"><input class="emp" type="text" value="${len[i].empresa}"></td>
            <td class="text-left">${len[i].tmst}</td>
        </tr>
      `
      table.innerHTML += dat;
  }
  $('.lic').change(function() {
    var alexaid = $(this).closest('tr').find('td:nth-child(1)').text();
    var licencia = $(this).val();
    socket.emit('licencia', {licencia: licencia, alexaid: alexaid});
  });
  $('.emp').change(function() {
    var alexaid = $(this).closest('tr').find('td:nth-child(1)').text();
    var empresa = $(this).val();
    socket.emit('empresa', {empresa: empresa, alexaid: alexaid});
  });
});