<?php
require  './vendor/autoload.php';
use WebSocket\Client;
$url = "ws://127.0.0.1:8888";
$client = new Client($url);
//@c.us to personal number
//@g.us to group
//$message = ['type' => 'sendWa','to' => '6285648048011-1344420669@g.us', 'message' => 'kirim ke group dari websocket'];
//$filePath = '/home/ahmad/Dokumen/kelengkapan_akte_KK.pdf';
//$filePath = '/home/ahmad/Gambar/approved.png';
//$imageData = ['mimetype' => mime_content_type($filePath), 'b64data' => base64_encode(file_get_contents($filePath)), 'filename' => basename($filePath) ];
$message = ['type' => 'sendWa', 
    'data' => [
//        ['to' => '6285546528986@c.us', 'message' => 'approved', 'options' => ['media' => $imageData]],
        ['to' => '6282333808291@c.us', 'message' => date('Y-m-d H:i:s'). ' percobaan kirim dari php websocket client'],
        //['to' => '62857909009@c.us', 'message' => date('Y-m-d H:i:s'). '**link klik saya** dari php websocket client'],
    ]
];

$client->send(json_encode($message));
//echo $client->receive();
$client->close();
