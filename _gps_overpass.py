import urllib.request
import urllib.error
import urllib.parse
import json

LAT, LNG = 15.5524, 73.7516
meters = 3000
# EXACT query string produced by fetchNearbyPOIs in js/maps.js
q = f'[out:json][timeout:25];(' \
    f'node["amenity"~"^(hospital|clinic)$"](around:{meters},{LAT},{LNG});' \
    f'way["amenity"~"^(hospital|clinic)$"](around:{meters},{LAT},{LNG});' \
    f'node["amenity"="fuel"](around:{meters},{LAT},{LNG});' \
    f'way["amenity"="fuel"](around:{meters},{LAT},{LNG});' \
    f'node["amenity"~"^(restaurant|cafe)$"](around:{meters},{LAT},{LNG});' \
    f'way["amenity"~"^(restaurant|cafe)$"](around:{meters},{LAT},{LNG});' \
    f'node["tourism"~"^(attraction|museum)$"](around:{meters},{LAT},{LNG});' \
    f'way["tourism"~"^(attraction|museum)$"](around:{meters},{LAT},{LNG});' \
    f');out center 40;'

body = ('data=' + urllib.parse.quote(q)).encode('utf-8')
for ep in ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']:
    for use_get in [False, True]:
        try:
            if use_get:
                req = urllib.request.Request(ep + '?' + body.decode('utf-8'))
            else:
                req = urllib.request.Request(ep, data=body,
                    headers={'Content-Type': 'application/x-www-form-urlencoded'})
            r = urllib.request.urlopen(req, timeout=45)
            j = json.loads(r.read().decode())
            print('OK %s get=%s status=%s elements=%d' % (ep.split('//')[1].split('/')[0], use_get, r.status, len(j.get('elements', []))))
            for el in j.get('elements', [])[:6]:
                t = el.get('tags', {}); co = el.get('center') or {}
                print('   type=%s name=%s lat=%s lon=%s clat=%s clon=%s' % (t.get('amenity') or t.get('tourism'), t.get('name'), el.get('lat'), el.get('lon'), co.get('lat'), co.get('lon')))
            print('QUERY_VALID=TRUE')
            raise SystemExit(0)
        except urllib.error.HTTPError as e:
            # 406/504/400 are rate-limit or overload responses, not parse errors
            print('HTTP %s %s get=%s status=%s' % (ep.split('//')[1].split('/')[0], 'POST' if not use_get else 'GET', use_get, e.code))
        except SystemExit:
            raise
        except Exception as e:
            print('ERR %s get=%s %s' % (ep.split('//')[1].split('/')[0], use_get, e))
print('QUERY_VALID=UNCERTAIN (all mirrors unavailable)')
