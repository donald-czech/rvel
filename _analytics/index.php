<?php
declare(strict_types=1);
header('X-Robots-Tag: noindex, nofollow', true);

$file = __DIR__ . '/events.jsonl';
$events = [];

if (is_file($file)) {
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    foreach ($lines as $line) {
        $event = json_decode($line, true);
        if (is_array($event)) $events[] = $event;
    }
}

function count_by(array $events, string $key): array {
    $counts = [];
    foreach ($events as $event) {
        $value = trim((string)($event[$key] ?? ''));
        if ($value === '') $value = 'Neznámé';
        $counts[$value] = ($counts[$value] ?? 0) + 1;
    }
    arsort($counts);
    return $counts;
}

function h(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

$pageViews = array_values(array_filter($events, fn($e) => ($e['type'] ?? '') === 'pageview'));
$clicks = array_values(array_filter($events, fn($e) => ($e['type'] ?? '') === 'click'));
$visitors = count(array_unique(array_map(fn($e) => (string)($e['ipHash'] ?? ''), $events)));
$lastEvent = $events ? end($events) : null;
?>
<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Soukromá analytika | R. V. Elektro</title>
  <style>
    :root { color-scheme: light dark; --bg:#f6f7fb; --card:#fff; --text:#101319; --muted:#667085; --line:#d9dee8; --accent:#0f6fff; }
    body { margin:0; font-family: Arial, Helvetica, sans-serif; background:var(--bg); color:var(--text); }
    main { max-width:1180px; margin:0 auto; padding:34px 18px; }
    h1 { margin:0 0 8px; font-size:38px; }
    p { color:var(--muted); }
    .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin:24px 0; }
    .card { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:18px; box-shadow:0 16px 36px rgba(15,23,42,.08); }
    .metric { font-size:34px; font-weight:800; }
    .label { color:var(--muted); font-size:14px; }
    .tables { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
    table { width:100%; border-collapse:collapse; font-size:14px; }
    th, td { padding:10px 0; border-bottom:1px solid var(--line); text-align:left; vertical-align:top; }
    th:last-child, td:last-child { text-align:right; }
    .wide { grid-column:1 / -1; }
    .muted { color:var(--muted); }
    @media (max-width:900px) { .grid, .tables { grid-template-columns:1fr; } }
    @media (prefers-color-scheme: dark) { :root { --bg:#0e1116; --card:#171b22; --text:#f3f6fb; --muted:#a8b0bd; --line:#2b3340; --accent:#65a6ff; } }
  </style>
</head>
<body>
<main>
  <h1>Soukromá analytika</h1>
  <p>Data se ukládají lokálně na tomto webu do složky <strong>_analytics</strong>. Stránka není nikde odkazovaná a má nastavené noindex.</p>

  <section class="grid">
    <div class="card"><div class="metric"><?= count($pageViews) ?></div><div class="label">Zobrazení stránek</div></div>
    <div class="card"><div class="metric"><?= $visitors ?></div><div class="label">Odhad návštěvníků</div></div>
    <div class="card"><div class="metric"><?= count($clicks) ?></div><div class="label">Kliknutí</div></div>
    <div class="card"><div class="metric"><?= $lastEvent ? h(substr((string)$lastEvent['time'], 0, 16)) : '-' ?></div><div class="label">Poslední událost UTC</div></div>
  </section>

  <section class="tables">
    <?php foreach ([
      'Navštívené stránky' => ['events' => $pageViews, 'key' => 'page'],
      'Odkud přišli' => ['events' => $pageViews, 'key' => 'referrer'],
      'Kliknutí' => ['events' => $clicks, 'key' => 'targetText'],
      'Prohlížeče' => ['events' => $events, 'key' => 'browser'],
      'Operační systémy' => ['events' => $events, 'key' => 'os'],
      'Zařízení' => ['events' => $events, 'key' => 'device'],
      'Země' => ['events' => $events, 'key' => 'country'],
      'Jazyky' => ['events' => $events, 'key' => 'language'],
    ] as $title => $config): ?>
      <div class="card">
        <h2><?= h($title) ?></h2>
        <table>
          <thead><tr><th>Hodnota</th><th>Počet</th></tr></thead>
          <tbody>
          <?php foreach (array_slice(count_by($config['events'], $config['key']), 0, 12, true) as $value => $count): ?>
            <tr><td><?= h($value) ?></td><td><?= $count ?></td></tr>
          <?php endforeach; ?>
          <?php if (!count($config['events'])): ?><tr><td class="muted">Zatím žádná data</td><td>0</td></tr><?php endif; ?>
          </tbody>
        </table>
      </div>
    <?php endforeach; ?>

    <div class="card wide">
      <h2>Poslední události</h2>
      <table>
        <thead><tr><th>Čas</th><th>Typ</th><th>Stránka / cíl</th><th>Zařízení</th></tr></thead>
        <tbody>
        <?php foreach (array_reverse(array_slice($events, -30)) as $event): ?>
          <tr>
            <td><?= h((string)($event['time'] ?? '')) ?></td>
            <td><?= h((string)($event['type'] ?? '')) ?></td>
            <td><?= h((string)(($event['targetText'] ?? '') ?: ($event['page'] ?? ''))) ?></td>
            <td><?= h(trim((string)($event['os'] ?? '') . ' / ' . (string)($event['browser'] ?? ''))) ?></td>
          </tr>
        <?php endforeach; ?>
        <?php if (!$events): ?><tr><td class="muted" colspan="4">Zatím žádná data</td></tr><?php endif; ?>
        </tbody>
      </table>
    </div>
  </section>
</main>
</body>
</html>
