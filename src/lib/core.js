import jquery from "jquery";
import Swal from "sweetalert2";

window.$ = jquery;

checkApiStatus();

let isSlim = false;
let nextRequest = Date.now() + 1000;

function upload(data, retryCount) {
  console.info("Trying to upload to mineskin");
  setTimeout(
    function() {
      $.ajax({
        type: "post",
        url: "https://api.mineskin.org/generate/upload",
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        dataType: "json",
        encode: true
      })
        .done(function(response) {
          const signature = response.data.texture.signature;
          const value = response.data.texture.value;
          if (response.nextRequest) {
            nextRequest = Date.now() + response.nextRequest * 1000;
          } else {
            nextRequest = Date.now() + 10000;
          }
          if (signature && value) {
            Swal.fire({
              icon: "success",
              title: "Enjoy your skin",
              text: "The system is now going to download a skin file!"
            }).then();
            /* Create File */
            let customFileName = $("#fileName").val().toLowerCase();

            const fileData = {
              skinName: customFileName === "" ? response.id : customFileName,
              value: value,
              signature: signature,
              dataVersion: 1
            };

            const blob = new Blob([JSON.stringify(fileData)], {
              type: "text/plain;charset=utf-8"
            });
            saveAs(blob, fileData.skinName + ".customskin");
            /* ----------- */
          } else {
            if (retryCount > 0) {
              upload(data, retryCount - 1);
            } else {
              Swal.fire({
                icon: "error",
                title: "Sorry, something went wrong!",
                text: "Please upload a minecraft skin or reload the site."
              }).then();
            }
          }

          $("#imageFile").val("");
        })
        .fail(function(response) {
          console.error("Fail : ", response);
          if (retryCount > 0) {
            upload(data, retryCount - 1);
          } else {
            Swal.fire({
              icon: "error",
              title: "Sorry, something went wrong!",
              text: "Please upload a minecraft skin or reload the site."
            }).then();
          }
        });
    },
    Math.max(500, nextRequest - Date.now())
  );
}

$("#imageFile").on("change", function() {
  skinChecker(URL.createObjectURL(event.target.files[0]), function() {
    console.debug("slimness: " + isSlim);
    $("#skintype-alex").prop("checked", isSlim);
    $("#skintype-steve").prop("checked", !isSlim);
  });
});

$("#uploadFile").on("submit", function(e) {
  e.preventDefault();
  const imageFile = $("#imageFile");
  if (imageFile.val()) {
    const data = new FormData();
    data.append("file", imageFile[0].files[0]);
    data.append("variant", isSlim ? "slim" : "classic");

    upload(data, 2);
  } else {
    Swal.fire({
      icon: "warning",
      title: "Sorry, something went wrong!",
      text: "Please select a minecraft skin first."
    }).then();
  }
});

/* Check what type of skins (Alex or Steve) */
function skinChecker(skinURL, callback) {
  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = skinURL;

  image.onload = function() {
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
    if (callback !== undefined) {
      callback();
    }
  };
}

$("#skintype-steve").on("change", function() {
  isSlim = false;
});

/* If user changes skintype radios */
$("#skintype-alex").on("change", function() {
  isSlim = true;
});

$("#reverseFile").on("submit", function(e) {
  e.preventDefault();
  const skinFile = $("#skinFile");
  if (!skinFile.val()) {
    Swal.fire({
      icon: "warning",
      title: "Sorry, something went wrong!",
      text: "Please select a skin file first."
    }).then();
  }

  skinFile[0].files[0].text().then(function(text) {
    handleSkinText(text).catch(function(error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Sorry, something went wrong!",
        text: "Please upload a valid skin file or reload the site."
      }).then();
    });
  });
});

async function handleSkinText(text) {
  const textJson = JSON.parse(text);
  const decodedValue = JSON.parse(window.atob(textJson.value));

  const skinUrl = decodedValue["textures"]["SKIN"]["url"];
  window.open(skinUrl);
}

/* Check MineSkin API */
function checkApiStatus() {
  $.ajax({
    type: "get",
    url: "https://api.mineskin.org/get/delay",
    dataType: "json",
    encode: true
  }).fail(function() {
    const statusBadge = $("#api-status-badge");
    statusBadge.html("DOWN");
    statusBadge.removeClass("bg-success");
    statusBadge.addClass("bg-danger");
  });
}
