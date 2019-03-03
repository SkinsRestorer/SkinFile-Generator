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
        url: 'https://api.mineskin.org/generate/upload',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        dataType: 'json',
        encode: true
      }).done(function(response){
        var signature = response.data.texture.signature;
        var value = response.data.texture.value;
        if(signature && value){
          swal({
            type: 'success',
            title: 'Enjoy your skin',
            text: 'The System going to download a skin file!'
          });

          /* Create File */
          var download = $('<a>', {
            href: 'data:text/plain;charset=utf-8,' + encodeURIComponent(value + '\n' + signature + '\n' + 9223243187835955807),
            target: '_blank',
            download: response.id + '.skin'
          });
          download[0].click();
          /* ----------- */
        } else {
          swal({
            type: 'error',
            title: 'Sorry, something went wrong!',
            text: "Please re-upload a minecraft's skin or reload the site."
          });
        }

        $('.custom-file-input').val('');
        $('.custom-file-label').html('Choose skins(s)...');
      }).fail(function(response){
        swal({
          type: 'error',
          title: 'Sorry, something went wrong!',
          text: "Please upload a minecraft's skin or reload the site."
        });
        console.log('Fail : ' + response);
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
