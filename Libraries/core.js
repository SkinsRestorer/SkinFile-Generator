var fileName;
var isSlim = false;
var skinURL;

function upload(data, retrycount) {
  console.log("try upload to mineskin");
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
      var blob = new Blob([value+'\n'+signature+'\n'+4102444800000], {type: "text/plain;charset=utf-8"});
      saveAs(blob, $('#fileName').val() == '' ? response.id + '.skin' : $('#fileName').val() + '.skin');
      /* ----------- */
    } else {
      if (retrycount>0) {
        upload(data, retrycount-1)
      } else {
        swal({
          type: 'error',
          title: 'Sorry, something went wrong!',
          text: "Please upload a minecraft's skin or reload the site."
        });
      }
    }

    $('.custom-file-input').val('');
    $('.custom-file-label').html('Choose skins(s)...');
  }).fail(function(response){
    console.log('Fail : ' + response);
    if (retrycount>0) {
      upload(data, retrycount-1)
    } else {
      swal({
        type: 'error',
        title: 'Sorry, something went wrong!',
        text: "Please upload a minecraft's skin or reload the site."
      });
    }
  });
}


$('.custom-file-input').on('change', function(){
  fileName = $(this).val().split('\\').pop();
  if(fileName){
    $(this).next('.custom-file-label').html(fileName);
    console.log('File selected : ' + fileName);
  } else {
    $(this).next('.custom-file-label').html('Choose skins(s)...');
    console.log('No file selected!');
  }

  skinURL = URL.createObjectURL(event.target.files[0]);
  skinChecker(function(){
    console.log('slimness: ' + isSlim);
    $("#skintype-alex").prop("checked", isSlim);
    $("#skintype-steve").prop("checked", !isSlim);
  });
});

$('#uploadFile').on('submit', function(e){
  e.preventDefault();
  if($('.custom-file-input').val()){
    var data = new FormData($(this)[0]);
    upload(data, 2);
  } else {
    swal({
      type: 'warning',
      title: 'Sorry, something went wrong!',
      text: "Please select a minecraft's skin first."
    });
  }
});

/* Check what type of skins (Alex or Steve) */
function skinChecker(callback){
  var image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = skinURL;

  image.onload = function(){
    var detectCanvas = document.createElement("canvas");
    var detectCtx = detectCanvas.getContext("2d");
    detectCanvas.width = image.width;
    detectCanvas.height = image.height;
    detectCtx.drawImage(image, 0, 0);
    var px1 = detectCtx.getImageData(46, 52, 1, 12).data;
    var px2 = detectCtx.getImageData(54, 20, 1, 12).data;
    var allTransparent = true;
    for(var i = 3; i < 12 * 4; i += 4){
      if(px1[i] === 255){
        allTransparent = false;
        break;
      }
      if (px2[i] === 255) {
        allTransparent = false;
        break;
      }
    }
    isSlim = allTransparent;
    if(callback !== undefined){ callback(); }
  }
}

/* If user changes skintype radios */
$("[id^=skintype-]").on("change", function(){
  isSlim = !isSlim;

  skinChecker(function(){
    console.log('slimness: ' + isSlim);
    $("#skintype-alex").prop("checked", isSlim);
    $("#skintype-steve").prop("checked", !isSlim);
  });
});
