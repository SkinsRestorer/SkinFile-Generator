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
    if($('.custom-file-input').val()){
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
        if(respond.fileName && respond.usageCount){
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
        } else {
          swal({
            type: 'error',
            title: 'Sorry, something went wrong!',
            text: "Please upload a minecraft's skin or reload the site."
          });
        }

        $('.custom-file-input').val('');
        $('.custom-file-label').html('Choose skins(s)...');
      }).fail(function(respond){
        swal({
          type: 'error',
          title: 'Sorry, something went wrong!',
          text: "Please upload a minecraft's skin or reload the site."
        });
        console.log('Fail : ' + respond);
      });
    } else {
      swal({
        type: 'warning',
        title: 'Sorry, something went wrong!',
        text: "Please select a minecraft's skin first."
      });
    }
  });
});
