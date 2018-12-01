$(document).ready(function(){
  var fileName;

  $('.custom-file-input').on('change', function(){
    fileName = $(this).val().split('\\').pop();
    if(fileName){
      $(this).next('.custom-file-label').html(fileName);
      console.log('File selected : ' + fileName);
    } else {
      $(this).next('.custom-file-label').html('Choose skins(s)...');
      console.log('No file selected!');
    }
  });

  $('#uploadFile').on('submit', function(e){
    e.preventDefault();
    var data = new FormData($(this)[0]);
    $.ajax({
      type: 'post',
      url: 'Libraries/core.php',
      data: data,
      cache: false,
      processData: false,
      contentType: false,
      dataType: 'json',
      encode: true
    }).done(function(respond){
      console.log(respond);
      $('#usageCount').html(respond.usageCount);
      swal({
        type: 'success',
        title: 'Enjoy your skin',
        text: 'The System going to download a skin file!'
      });

      var download = $('<a>', {
        href: 'Skins/' + respond.fileName + '.skin',
        target: '_blank',
        download: respond.fileName + '.skin'
      });
      download[0].click();

      $('.custom-file-input').val('');
      $('.custom-file-label').html('Choose skins(s)...');
    });
  });
});
