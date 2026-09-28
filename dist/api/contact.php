<?php
/**
 * Pucón Inmobiliaria - Endpoint de contacto
 * Recibe: nombre, email, telefono, asunto, mensaje, honeypot, wantToSell
 * Responde: JSON con success + message
 *
 * Variables de entorno sugeridas (configurar en cPanel):
 *   PUCON_CONTACT_TO      -> email destinatario (ej. contacto@puconinmobiliaria.cl)
 *   PUCON_SITE_NAME       -> nombre del sitio (opcional)
 *
 * Si no se define PUCON_CONTACT_TO, se usa el fallback configurado abajo.
 */

// Configuración fallback (recomendable mover a variables de entorno del hosting)
$TO_EMAIL      = getenv('PUCON_CONTACT_TO') ?: 'info@puconinmobiliaria.cl';
$SITE_NAME     = getenv('PUCON_SITE_NAME') ?: 'Pucón Inmobiliaria';
$FROM_EMAIL    = 'noreply@puconinmobiliaria.cl';
$SUBJECT_PRE   = '[' . $SITE_NAME . '] Nuevo mensaje desde el sitio web';

// Headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

// Solo aceptamos POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Usa POST.'
    ]);
    exit;
}

// Honeypot simple: el campo "website_url" debe estar vacío
$honeypot = isset($_POST['website_url']) ? trim((string)$_POST['website_url']) : '';
if ($honeypot !== '') {
    // Bot detectado: respondemos éxito falso para no dar feedback
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Gracias por tu mensaje. Te contactaremos pronto.'
    ]);
    exit;
}

// Rate limiting básico (basado en IP + 5 minutos)
$ip      = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rateDir = sys_get_temp_dir() . '/pucon_contact_ratelimit';
if (!is_dir($rateDir)) {
    @mkdir($rateDir, 0755, true);
}
$rateFile = $rateDir . '/' . preg_replace('/[^a-zA-Z0-9_.]/', '_', $ip) . '.txt';
$now      = time();
$limit    = 3;             // máximo 3 envíos
$window   = 5 * 60;        // en 5 minutos

$count = 0;
if (file_exists($rateFile)) {
    $data = @file_get_contents($rateFile);
    if ($data !== false) {
        $data = trim($data);
        if (ctype_digit($data)) {
            $count = (int) $data;
        }
    }
}
if ($count >= $limit) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Has enviado demasiados mensajes. Intenta nuevamente en unos minutos.'
    ]);
    exit;
}

// Recolección + sanitización
function clean($key, $max = 500) {
    if (!isset($_POST[$key])) return '';
    $val = (string) $_POST[$key];
    $val = trim($val);
    $val = strip_tags($val);
    $val = preg_replace('/[\r\n]+/', "\n", $val);
    if (strlen($val) > $max) {
        $val = substr($val, 0, $max);
    }
    return $val;
}

$nombre    = clean('nombre', 100);
$email     = clean('email', 120);
$telefono  = clean('telefono', 40);
$asunto    = clean('asunto', 150);
$mensaje   = clean('mensaje', 2000);
$wantToSell = isset($_POST['wantToSell']) ? (string) $_POST['wantToSell'] : '';

// Validación
$errors = [];
if ($nombre === '' || mb_strlen($nombre) < 2) {
    $errors[] = 'El nombre es obligatorio.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email no válido.';
}
if ($mensaje === '' || mb_strlen($mensaje) < 10) {
    $errors[] = 'El mensaje debe tener al menos 10 caracteres.';
}
if ($telefono !== '' && !preg_match('/^[\d\s\+\-\(\)]{6,30}$/', $telefono)) {
    $errors[] = 'Teléfono no válido.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// Construcción del correo
$wantToSellBool = ($wantToSell === '1' || $wantToSell === 'true' || $wantToSell === 'on');
$subject = $SUBJECT_PRE . ($asunto !== '' ? ' - ' . $asunto : '');

$body  = "Has recibido un nuevo mensaje desde el formulario de contacto de {$SITE_NAME}.\n\n";
$body .= "Nombre:        {$nombre}\n";
$body .= "Email:         {$email}\n";
$body .= "Teléfono:      " . ($telefono !== '' ? $telefono : '(no proporcionado)') . "\n";
$body .= "Asunto:        " . ($asunto !== '' ? $asunto : '(sin asunto)') . "\n";
$body .= "Quiere vender: " . ($wantToSellBool ? 'Sí' : 'No') . "\n";
$body .= "IP:            {$ip}\n";
$body .= "Fecha:         " . date('Y-m-d H:i:s') . "\n";
$body .= "Origen:        " . ($_SERVER['HTTP_REFERER'] ?? 'directo') . "\n\n";
$body .= "------------------------------\n";
$body .= "MENSAJE:\n";
$body .= "------------------------------\n";
$body .= $mensaje . "\n";

$headers   = [];
$headers[] = 'From: ' . $SITE_NAME . ' <' . $FROM_EMAIL . '>';
$headers[] = 'Reply-To: ' . $nombre . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Content-Transfer-Encoding: 8bit';

$headersStr = implode("\r\n", $headers);

// Intento de envío
$sent = @mail($TO_EMAIL, $subject, $body, $headersStr);

// Actualizar contador rate-limit sólo si fue exitoso (o si validación fue ok)
@file_put_contents($rateFile, (string) ($count + 1));

if ($sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente. Te contactaremos pronto.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'No fue posible enviar el mensaje. Intenta nuevamente o escríbenos directamente a ' . $TO_EMAIL
    ]);
}
exit;
