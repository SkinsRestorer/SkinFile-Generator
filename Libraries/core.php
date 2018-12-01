<?php
	/* Check POST */
	if(empty($_FILES['file']['tmp_name'])){ die('Invalid request'); }

	/* Check file */
	$file = $_FILES['file']['tmp_name'];
	if(strncmp(mime_content_type($file), 'image/', 6) !== 0){ die('Invalid image file'); }

	/* Initialize File to POST */
	$postparam['file'] = new CURLFile($_FILES['file']['tmp_name'], $_FILES['file']['type'], $_FILES['file']['name']);

	/* Initialize CURL */
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'https://api.mineskin.org/generate/upload');
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $postparam);
	$response = curl_exec($ch);
	/* Check CURL response */
	if($response === false){ die(curl_error($ch)); }
	curl_close($ch);

	/* Check DATA from API response */
	$json = json_decode($response, true);
	if(empty($json['data']['texture']['value']) || empty($json['data']['texture']['signature'])) {
		die('MineSkin API returned unusable data');
	}
	/* Signed DATA */
	$value = $json['data']['texture']['value'];
	$signature = $json['data']['texture']['signature'];
	$timestamp = '9223243187835955807';

  /* Get Usage Count */
  $file = file_get_contents('../history.json');
  $usageCount = json_decode($file, true) + 1;
  $file = file_put_contents('../history.json', json_encode($usageCount));

	/* Create File */
  $fileName = date('Y-m-d-H-i-s') . '-' . $usageCount;
	$file = fopen('../Skins/' . $fileName . '.skin', 'w') or die('Unable to create file!');

	/* Generate Skin Data */
	fwrite($file, $value . PHP_EOL);
	fwrite($file, $signature . PHP_EOL);
	fwrite($file, $timestamp);
	fclose($file);

	/* Respond Data */
	$respond = [
		'fileName' => $fileName,
		'usageCount' => $usageCount
	];

	echo json_encode($respond);
?>
