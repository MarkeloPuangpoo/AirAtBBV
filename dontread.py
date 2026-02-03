import requests
import json

# URL เดิมที่ดึงประวัติ
url = "https://watch.kid-bright.org/diy/api/get?datasource=history_data_by_station&id=781C3CA55E54"

try:
    print("🔍 กำลังดึงข้อมูลดิบ...")
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    
    if response.status_code == 200:
        data = response.json()
        
        # เช็คว่าเป็น List หรือ Dictionary
        if isinstance(data, list):
            print(f"📦 ได้ข้อมูลมาเป็น List จำนวน: {len(data)} รายการ")
            if len(data) > 0:
                print("\n--- ตัวอย่างข้อมูลตัวแรก (Raw) ---")
                print(json.dumps(data[0], indent=4, ensure_ascii=False))
        else:
            print("📦 ได้ข้อมูลมาเป็น Dictionary")
            print(json.dumps(data, indent=4, ensure_ascii=False))
            
    else:
        print("❌ Error:", response.status_code)

except Exception as e:
    print("Error:", e)