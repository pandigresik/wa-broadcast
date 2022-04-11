<?php
function handleChat(array $msg){
    $sender = $msg['sender'];
    $message = $msg['message'];
    $_keyMessage = explode(' ', $message);
    $keyMessage = $_keyMessage[0];
    $_content = [];
    switch($keyMessage){
        case '/menu':
            $_content = [
                '/track *nomer op*',
                '/status *nomer op*',
                '/inbox *pin pelanggan*',
            ];
            break;
        case '/track':

            break;
        case '/status':

            break;
        case '/inbox':

        break;
        case '/pelanggan':
            break;
    }
    return implode(PHP_EOL, $_content);    
}

$_content = ['Pesan belum didefinisikan '];
switch($_SERVER['PATH_INFO']){    
    case '/chat':
        $_content = handleChat($_REQUEST);        
        break;
    case '/receive':

        break;
    default:

        break;            
}
$data['message'] = $_content;    
header('Content-Type: application/json');
echo json_encode($data);