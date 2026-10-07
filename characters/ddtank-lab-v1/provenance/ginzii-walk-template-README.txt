แม่แบบท่าเดิน 8 ทิศ (หุ่น 3 มิติสีเทา) สำหรับให้ AI วาดตัวละครทับ
https://toy.ginzii.com/walk-template

template-<ทิศ>-green.png    พื้นเขียว 00FF00 (ตัวละครที่ไม่มีสีเขียว)
template-<ทิศ>-magenta.png  พื้นแมเจนต้า FF00FF (ตัวละครที่มีสีเขียว)
  ขนาด 1376x1032 (4:3) แบ่ง 2 แถว x 4 ช่อง ช่องละ 344x516 = 8 เฟรมของรอบเดินเดียว เรียงซ้ายไปขวา บนลงล่าง
  ทิศ: down ลง (หันเข้ากล้อง) · downleft ซ้ายล่าง · left ซ้าย · upleft ซ้ายบน · up ขึ้น (หันหลัง) · upright ขวาบน · right ขวา · downright ขวาล่าง

pose3d.html + three.module.js  ซอร์สหุ่น 3 มิติ (three.js) แก้สัดส่วน/ท่า/มุมกล้องเองได้
  ดับเบิลคลิก pose3d.html เปิดได้เลย (ต้องต่อเน็ต — โหลด three.js จาก CDN)
  หรือเปิดผ่านเซิร์ฟเวอร์ เช่น  python3 -m http.server  แล้วเข้า http://localhost:8000/pose3d.html (ใช้ three.module.js ที่แนบมา ไม่ต้องต่อเน็ต)
  pose3d.html?sheet=left            แผ่นแม่แบบของทิศนั้น
  pose3d.html?sheet=left&bg=00ff00  เปลี่ยนสีพื้น  (ค่าปรับอื่นอยู่ในหัวไฟล์)

ใช้ฟรี ไม่มีเงื่อนไข · three.js เป็นของ three.js authors (MIT License)
