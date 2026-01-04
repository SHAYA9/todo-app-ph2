# backend/generate_vapid_keys.py
from pywebpush import generate_vapid_keys
import json

vapid_keys = generate_vapid_keys()
print(json.dumps({
    'public_key': vapid_keys.public_key.decode('utf-8'),
    'private_key': vapid_keys.private_key.decode('utf-8')
}))
