"""Rebuild commercially reusable, lazy-loaded GeoNames city-search assets.
Usage: python3 scripts/build-city-catalog.py CITIES_ZIP COUNTRY_INFO ADMIN1_CODES VERSION
Downloads are deliberately separate from production builds. Sources and licence
are recorded in the generated metadata and attributed on the privacy page.
"""
import collections
import hashlib
import json
from pathlib import Path
import sys
import unicodedata
import zipfile


def normalize(value):
    value = unicodedata.normalize('NFKD', value.lower())
    value = ''.join(c for c in value if not unicodedata.category(c).startswith('M'))
    return ' '.join(''.join(c if c.isalnum() else ' ' for c in value).split())


def bucket(value):
    result = 0
    for char in value[:2]:
        result = (result * 31 + ord(char)) & 0xffffffff
    return f'{result % 1024:03x}'


def main():
    archive, country_file, admin_file, version = sys.argv[1:]
    if not version.isalnum():
        raise ValueError('Version must be alphanumeric')
    countries = {}
    for line in Path(country_file).read_text().splitlines():
        if line and not line.startswith('#'):
            fields = line.split('\t')
            countries[fields[0]] = fields[4]
    admins = {}
    for line in Path(admin_file).read_text().splitlines():
        fields = line.split('\t')
        admins[fields[0]] = fields[1]
    with zipfile.ZipFile(archive) as zipped:
        name = next(n for n in zipped.namelist() if n.startswith('cities') and n.endswith('.txt'))
        cities = [line.split('\t') for line in zipped.read(name).decode('utf8').splitlines()]
    cities = [c for c in cities if c[17] and c[8] in countries]
    cities.sort(key=lambda c: (-int(c[14] or 0), int(c[0])))
    country_names = sorted(set(countries.values()))
    admin_names = sorted(set(admins.values()) | {''})
    zones = sorted({c[17] for c in cities})
    country_ids = {v: i for i, v in enumerate(country_names)}
    admin_ids = {v: i for i, v in enumerate(admin_names)}
    zone_ids = {v: i for i, v in enumerate(zones)}
    shards = collections.defaultdict(list)
    for city in cities:
        # Retain native, ASCII and alternate city names, including historical names.
        keys = {normalize(v) for v in [city[1], city[2], *city[3].split(',')] if v}
        keys = {k for k in keys if len(k) >= 2}
        groups = collections.defaultdict(list)
        for key in sorted(keys):
            groups[bucket(key)].append(key)
        row = [city[1], admin_ids[admins.get(city[8] + '.' + city[10], '')],
               country_ids[countries[city[8]]], zone_ids[city[17]]]
        for shard, names in groups.items():
            shards[shard].append([*row, names])
    output = Path(__file__).resolve().parents[1] / 'public' / 'city-search' / version
    output.mkdir(parents=True, exist_ok=False)
    for shard, rows in shards.items():
        (output / (shard + '.json')).write_text(json.dumps(rows, ensure_ascii=False, separators=(',', ':')) + '\n')
    metadata = {'version': version, 'cityCount': len(cities), 'countries': country_names,
                'admins': admin_names, 'zones': zones, 'shards': sorted(shards),
                'attribution': 'City names, regions and timezone identifiers adapted from GeoNames.',
                'source': 'https://download.geonames.org/export/dump/',
                'license': 'https://creativecommons.org/licenses/by/4.0/',
                'sourceSha256': hashlib.sha256(Path(archive).read_bytes()).hexdigest()}
    (output / 'metadata.json').write_text(json.dumps(metadata, ensure_ascii=False, separators=(',', ':')) + '\n')
    sizes = [p.stat().st_size for p in output.glob('*.json')]
    print(json.dumps({'cities': len(cities), 'files': len(sizes), 'bytes': sum(sizes), 'largestShard': max(sizes)}))


if __name__ == '__main__':
    main()
