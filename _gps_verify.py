import urllib.request
import urllib.error
import urllib.parse
import json

out = []
def log(s):
    out.append(s)
    print(s)

# 1) Backend health
try:
    r = urllib.request.urlopen('http://localhost:8000/api/health', timeout=5)
    log('HEALTH status=%s body=%s' % (r.status, r.read().decode()[:120]))
except Exception as e:
    log('HEALTH ERR %s' % e)

# 2) Backend SOS accepts real coords
try:
    data = json.dumps({'lat': 15.5524, 'lng': 73.7516}).encode()
    req = urllib.request.Request('http://localhost:8000/api/emergency/sos', data=data,
        headers={'Content-Type': 'application/json'})
    r = urllib.request.urlopen(req, timeout=5)
    log('SOS status=%s body=%s' % (r.status, r.read().decode()[:160]))
except Exception as e:
    log('SOS ERR %s' % e)

# 3) OSRM route (real distance/duration/geometry)
url = 'https://router.project-osrm.org/route/v1/driving/73.7516,15.5524;73.7737,15.4920?overview=full&geometries=geojson'
try:
    r = urllib.request.urlopen(url, timeout=30)
    j = json.loads(r.read().decode())
    if j.get('routes'):
        ro = j['routes'][0]
        log('OSRM status=%s distance_m=%d duration_s=%d geom_pts=%d' % (
            r.status, ro['distance'], ro['duration'], len(ro['geometry']['coordinates'])))
    else:
        log('OSRM no routes: %s' % json.dumps(j)[:200])
except Exception as e:
    log('OSRM ERR %s' % e)

# 4) Overpass (kumi mirror) real nearby POIs
q = '[out:json][timeout:15];node["amenity"~"^(hospital|clinic)$"](around:3000,15.5524,73.7516);out center 20;'
body = ('data=' + urllib.parse.quote(q)).encode('utf-8')
for ep in ['https://overpass.kumi.systems/api/interpreter', 'https://overpass-api.de/api/interpreter']:
    try:
        req = urllib.request.Request(ep, data=body,
            headers={'Content-Type': 'application/x-www-form-urlencoded'})
        r = urllib.request.urlopen(req, timeout=30)
        j = json.loads(r.read().decode())
        log('OVERPASS [%s] status=%s elements=%d' % (ep.split('//')[1].split('/')[0], r.status, len(j.get('elements', []))))
        for el in j.get('elements', [])[:5]:
            log('   lat=%s lon=%s name=%s' % (el.get('lat'), el.get('lon'), el.get('tags', {}).get('name')))
        break
    except urllib.error.HTTPError as e:
        log('OVERPASS [%s] HTTPError=%s' % (ep.split('//')[1].split('/')[0], e.code))
    except Exception as e:
        log('OVERPASS [%s] ERR=%s' % (ep.split('//')[1].split('/')[0], e))

with open('_gps_verify_out.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
