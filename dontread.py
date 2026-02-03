import requests
import json

# URL เดิม
url = "https://watch.kid-bright.org/diy/api/scan?datasource=latest_data_by_station&lat=13.504004&lon=101.002182"

try:
    response = requests.get(url)
    data = response.json()
    
    if len(data) > 0:
        print("🔍 ตัวอย่างข้อมูลดิบ (Station แรก):")
        # สั่งปริ้นท์โครงสร้าง JSON ออกมาดูตรงๆ เลย
        print(json.dumps(data[0], indent=4, ensure_ascii=False))
    else:
        print("ไม่พบข้อมูลสถานี")

except Exception as e:
    print("Error:", e)