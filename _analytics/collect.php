<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow', true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw ?: '', true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_json']);
    exit;
}

function clean_string($value, int $max = 500): string {
    if (!is_string($value)) return '';
    $value = trim($value);
    $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value) ?? '';
    return mb_substr($value, 0, $max, 'UTF-8');
}

function client_ip(): string {
    $candidates = [
        $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '',
        $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '',
        $_SERVER['REMOTE_ADDR'] ?? '',
    ];

    foreach ($candidates as $candidate) {
        $ip = trim(explode(',', $candidate)[0]);
        if (filter_var($ip, FILTER_VALIDATE_IP)) return $ip;
    }

    return '';
}

function anonymize_ip(string $ip): string {
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
        $parts = explode('.', $ip);
        $parts[3] = '0';
        return implode('.', $parts);
    }

    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
        $parts = explode(':', $ip);
        return implode(':', array_slice($parts, 0, 4)) . '::';
    }

    return '';
}

function country_hint(): string {
    $headers = [
        $_SERVER['HTTP_CF_IPCOUNTRY'] ?? '',
        $_SERVER['HTTP_X_VERCEL_IP_COUNTRY'] ?? '',
        $_SERVER['HTTP_CLOUDFRONT_VIEWER_COUNTRY'] ?? '',
    ];

    foreach ($headers as $country) {
        $country = strtoupper(trim($country));
        if (preg_match('/^[A-Z]{2}$/', $country)) return $country;
    }

    return 'Neznámá';
}

$event = [
    'time' => gmdate('c'),
    'type' => clean_string($input['type'] ?? '', 40),
    'page' => clean_string($input['page'] ?? '', 300),
    'title' => clean_string($input['title'] ?? '', 200),
    'referrer' => clean_string($input['referrer'] ?? '', 500),
    'target' => clean_string($input['target'] ?? '', 300),
    'targetText' => clean_string($input['targetText'] ?? '', 160),
    'browser' => clean_string($input['browser'] ?? '', 80),
    'os' => clean_string($input['os'] ?? '', 80),
    'device' => clean_string($input['device'] ?? '', 40),
    'language' => clean_string($input['language'] ?? '', 40),
    'screen' => clean_string($input['screen'] ?? '', 40),
    'viewport' => clean_string($input['viewport'] ?? '', 40),
    'country' => country_hint(),
    'ipHash' => hash('sha256', anonymize_ip(client_ip()) . '|rvelektro-local-analytics'),
    'userAgent' => clean_string($_SERVER['HTTP_USER_AGENT'] ?? '', 500),
];

if ($event['type'] === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'missing_type']);
    exit;
}

$file = __DIR__ . '/events.jsonl';
$line = json_encode($event, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;

if (file_put_contents($file, $line, FILE_APPEND | LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'write_failed']);
    exit;
}

echo json_encode(['ok' => true]);
