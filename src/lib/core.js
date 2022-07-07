import jquery from "jquery";
import Swal from 'sweetalert2';

window.$ = jquery;

checkApiStatus();

let fileName;
let isSlim = false;
let skinURL;
let nextRequest = Date.now() + 1000;

function upload(data, retrycount) {
  console.log("try upload to mineskin");
  setTimeout(function () {
    $.ajax({
      type: 'post',
      url: 'https://api.mineskin.org/generate/upload',
      data: data,
      cache: false,
      processData: false,
      contentType: false,
      dataType: 'json',
      encode: true
    }).done(function (response) {
      const signature = response.data.texture.signature;
      const value = response.data.texture.value;
      if (response.nextRequest) {
        nextRequest = Date.now() + (response.nextRequest * 1000);
      } else {
        nextRequest = Date.now() + 10000;
      }
      if (signature && value) {
        Swal.fire({
          type: 'success',
          title: 'Enjoy your skin',
          text: 'The system is now going to download a skin file!'
        });
        /* Create File */
        let fileName = $('#fileName').val().toLowerCase();
        const blob = new Blob([value + '\n' + signature + '\n' + 4102444800000], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName === '' ? response.id + '.skin' : fileName + '.skin');
        /* ----------- */
      } else {
        if (retrycount > 0) {
          upload(data, retrycount - 1)
        } else {
          swal({
            type: 'error',
            title: 'Sorry, something went wrong!',
            text: "Please upload a minecraft skin or reload the site."
          });
        }
      }

      $('.custom-file-input').val('');
      $('.custom-file-label').html('Choose skins(s)...');
    }).fail(function (response) {
      console.log('Fail : ' + response);
      if (retrycount > 0) {
        upload(data, retrycount - 1)
      } else {
        Swal.fire({
          type: 'error',
          title: 'Sorry, something went wrong!',
          text: "Please upload a minecraft skin or reload the site."
        });
      }
    });
  }, Math.max(500, nextRequest - Date.now()));
}

$('#skinFile').on('change', function () {
  fileName = $(this).val().split('\\').pop();
  if (fileName) {
    $(this).next('.custom-file-label').html(fileName);
    console.log('File selected : ' + fileName);
  } else {
    $(this).next('.custom-file-label').html('Choose skins(s)...');
    console.log('No file selected!');
  }

  skinURL = URL.createObjectURL(event.target.files[0]);
  skinChecker(function () {
    console.log('slimness: ' + isSlim);
    $("#skintype-alex").prop("checked", isSlim);
    $("#skintype-steve").prop("checked", !isSlim);
  });
});

$('#uploadFile').on('submit', function (e) {
  e.preventDefault();
  if ($('#skinFile').val()) {
    const data = new FormData($(this)[0]);
    upload(data, 2);
  } else {
    Swal.fire({
      type: 'warning',
      title: 'Sorry, something went wrong!',
      text: "Please select a minecraft skin first."
    });
  }
});

/* Check what type of skins (Alex or Steve) */
function skinChecker(callback) {
  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = skinURL;

  image.onload = function () {
    const detectCanvas = document.createElement("canvas");
    const detectCtx = detectCanvas.getContext("2d");
    detectCanvas.width = image.width;
    detectCanvas.height = image.height;
    detectCtx.drawImage(image, 0, 0);
    const px1 = detectCtx.getImageData(46, 52, 1, 12).data;
    const px2 = detectCtx.getImageData(54, 20, 1, 12).data;
    let allTransparent = true;
    for (let i = 3; i < 12 * 4; i += 4) {
      if (px1[i] === 255) {
        allTransparent = false;
        break;
      }
      if (px2[i] === 255) {
        allTransparent = false;
        break;
      }
    }
    isSlim = allTransparent;
    if (callback !== undefined) { callback(); }
  }
}

$("#skintype-steve").on("change", function () {
  isSlim = false;
});

/* If user changes skintype radios */
$("#skintype-alex").on("change", function () {
  isSlim = true;
});

/* Check MineSkin API */
function checkApiStatus() {
  $.ajax({
    type: 'get',
    url: 'https://api.mineskin.org/get/delay',
    dataType: 'json',
    encode: true
  }).fail(function (response) {
    const statusBadge = $('#api-status-badge');
    statusBadge.html('DOWN');
    statusBadge.removeClass('bg-success');
    statusBadge.addClass('bg-danger');
  });
}
