import React, { useState, useRef, useEffect } from 'react';

function App() {
  // --- States สำหรับจำลองขั้นตอนและการแสดงผล ---
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  let toastTimer = useRef(null);

  // --- States สำหรับฟอร์มและ Dropdowns ---
  const [storeName, setStoreName] = useState('');
  const [storeNameError, setStoreNameError] = useState(false);
  const [shaking, setShaking] = useState(false); // ควบคุมการเขย่าเมื่อเกิด Error

  const [foodType, setFoodType] = useState('');
  const [foodTypeDropdownOpen, setFoodTypeDropdownOpen] = useState(false);

  const [branch, setBranch] = useState('');
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [staffCount, setStaffCount] = useState('');

  const [income, setIncome] = useState('');
  const [incomeDropdownOpen, setIncomeDropdownOpen] = useState(false);

  const [posSystem, setPosSystem] = useState('');

  const [stockMethod, setStockMethod] = useState('');
  const [stockDropdownOpen, setStockDropdownOpen] = useState(false);

  // --- ฟังก์ชันการทำงานเลียนแบบตัวเก่า ---
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setShowToast(false);
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const formatTimeDisplay = (timeVal, defaultText) => {
    if (!timeVal) return defaultText;
    const [hourStr, minute] = timeVal.split(':');
    let hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${String(hour).padStart(2, '0')}:${minute} ${period}`;
  };

  const handleNextStep = () => {
    if (storeName.trim().length === 0) {
      setStoreNameError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500); // หยุดเอฟเฟกต์สั่นหลังจบแอนิเมชัน
      triggerToast('กรุณากรอกข้อมูลให้ครบก่อนไปต่อ');
      return;
    }

    if (currentStep < totalSteps) {
      const next = currentStep + 1;
      setCurrentStep(next);
      triggerToast(`บันทึกข้อมูลสำเร็จ! ไปยังขั้นตอนที่ ${next}`);
    } else {
      triggerToast('กรอกข้อมูลครบทุกขั้นตอนแล้ว 🎉');
    }
  };

  const resetForm = () => {
    setStoreName('');
    setStoreNameError(false);
    setFoodType('');
    setBranch('');
    setOpenTime('09:00');
    setCloseTime('22:00');
    setStaffCount('');
    setIncome('');
    setPosSystem('');
    setStockMethod('');
    setCurrentStep(1);
    triggerToast('ล้างข้อมูลทั้งหมดแล้ว');
  };

  const handleMenuAction = (action) => {
    setMenuOpen(false);
    if (action === 'reset') {
      resetForm();
    } else if (action === 'draft') {
      triggerToast('บันทึกแบบร่างแล้ว');
    } else if (action === 'cancel') {
      triggerToast('ยกเลิกการแก้ไข');
    }
  };

  // ปิด Dropdown ทั้งหมดเมื่อกดคลิกที่อื่นบนหน้าจอ
  const closeAllDropdowns = () => {
    setMenuOpen(false);
    setFoodTypeDropdownOpen(false);
    setIncomeDropdownOpen(false);
    setStockDropdownOpen(false);
  };

  return (
    <div className="phone" onClick={closeAllDropdowns}>
      {/* Header */}
      <header className="topbar">
        <button 
          className="icon-btn" 
          id="backBtn" 
          aria-label="ย้อนกลับ"
          onClick={(e) => { e.stopPropagation(); triggerToast('ย้อนกลับ'); }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="topbar-title">ข้อมูลร้านอาหาร</h1>
        <div className="menu-wrap" onClick={(e) => e.stopPropagation()}>
          <button 
            className="icon-btn" 
            id="menuBtn" 
            aria-label="เมนูเพิ่มเติม"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="12" r="2" fill="currentColor"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <circle cx="19" cy="12" r="2" fill="currentColor"/>
            </svg>
          </button>
          <div className={`dropdown-menu ${menuOpen ? 'open' : ''}`} id="menuDropdown">
            <button className="dropdown-item" onClick={() => handleMenuAction('draft')}>บันทึกแบบร่าง</button>
            <button className="dropdown-item" onClick={() => handleMenuAction('reset')}>ล้างข้อมูลทั้งหมด</button>
            <button className="dropdown-item danger" onClick={() => handleMenuAction('cancel')}>ยกเลิก</button>
          </div>
        </div>
      </header>

      {/* Progress Tracker */}
      <section className="progress-section">
        <div className="progress-row">
          <span className="progress-label">ขั้นตอนที่ <strong>{currentStep}</strong> จาก 4</span>
          <span className="progress-percent">{Math.round((currentStep / totalSteps) * 100)}% เสร็จสิ้น</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
      </section>

      <main className="form-scroll">
        {/* Card 1: ข้อมูลทั่วไป */}
        <section className="card">
          <div className="card-header">
            <span className="card-icon icon-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L4.5 4H19.5L21 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 9V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 20V14H15V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <h2 className="card-title">ข้อมูลทั่วไป</h2>
          </div>

          {/* ชื่อร้าน */}
          <div className="field">
            <label className="field-label" htmlFor="storeName">ชื่อร้าน</label>
            <div 
              className={`input-wrap ${storeNameError ? 'error' : ''}`} 
              style={shaking ? { animation: 'shake 0.4s ease' } : {}}
            >
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M7 2V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M5 2V7C5 8.1 5.9 9 7 9C8.1 9 9 8.1 9 7V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M7 11V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M17 2C15 2 14 4.5 14 7C14 8.5 15 9.5 16 9.8V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input 
                type="text" 
                id="storeName" 
                placeholder="ระบุชื่อร้านค้าของคุณ" 
                value={storeName}
                onChange={(e) => {
                  setStoreName(e.target.value);
                  if (e.target.value.trim().length > 0) setStoreNameError(false);
                }}
              />
            </div>
            <span className={`field-error ${storeNameError ? 'show' : ''}`} id="storeNameError">กรุณาระบุชื่อร้าน</span>
          </div>

          {/* ประเภทอาหาร */}
          <div className="field">
            <label className="field-label">ประเภทอาหาร</label>
            <div className={`dropdown ${foodTypeDropdownOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="dropdown-trigger"
                onClick={() => {
                  setFoodTypeDropdownOpen(!foodTypeDropdownOpen);
                  setIncomeDropdownOpen(false);
                  setStockDropdownOpen(false);
                }}
              >
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12C4 10 6 8 12 8C18 8 20 10 20 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <rect x="3" y="12" width="18" height="2.6" rx="1.3" fill="currentColor"/>
                    <path d="M4 16H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                <span className={`dropdown-value ${foodType ? 'selected' : ''}`}>
                  {foodType ? {
                    thai: 'อาหารไทย',
                    japanese: 'อาหารญี่ปุ่น',
                    italian: 'อาหารอิตาเลียน',
                    dessert: 'ของหวาน / เบเกอรี่',
                    cafe: 'คาเฟ่ / เครื่องดื่ม',
                    other: 'อื่นๆ'
                  }[foodType] : 'เลือกประเภทอาหาร'}
                </span>
                <svg className="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <ul className="dropdown-options">
                <li className={foodType === 'thai' ? 'selected' : ''} onClick={() => { setFoodType('thai'); setFoodTypeDropdownOpen(false); }}>อาหารไทย</li>
                <li className={foodType === 'japanese' ? 'selected' : ''} onClick={() => { setFoodType('japanese'); setFoodTypeDropdownOpen(false); }}>อาหารญี่ปุ่น</li>
                <li className={foodType === 'italian' ? 'selected' : ''} onClick={() => { setFoodType('italian'); setFoodTypeDropdownOpen(false); }}>อาหารอิตาเลียน</li>
                <li className={foodType === 'dessert' ? 'selected' : ''} onClick={() => { setFoodType('dessert'); setFoodTypeDropdownOpen(false); }}>ของหวาน / เบเกอรี่</li>
                <li className={foodType === 'cafe' ? 'selected' : ''} onClick={() => { setFoodType('cafe'); setFoodTypeDropdownOpen(false); }}>คาเฟ่ / เครื่องดื่ม</li>
                <li className={foodType === 'other' ? 'selected' : ''} onClick={() => { setFoodType('other'); setFoodTypeDropdownOpen(false); }}>อื่นๆ</li>
              </ul>
            </div>
          </div>

          {/* สาขา */}
          <div className="field">
            <label className="field-label" htmlFor="branch">สาขา</label>
            <div className="input-wrap">
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21C12 21 19 14.5 19 9.5C19 5.4 15.9 2 12 2C8.1 2 5 5.4 5 9.5C5 14.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
              </span>
              <input 
                type="text" 
                id="branch" 
                placeholder="เช่น สำนักงานใหญ่ หรือ สาขาสยาม" 
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Card 2: การดำเนินงาน */}
        <section className="card">
          <div className="card-header">
            <span className="card-icon icon-red">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 7V12L15.5 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <h2 className="card-title">การดำเนินงาน</h2>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label" htmlFor="openTime">เวลาเปิด</label>
              <div className="time-wrap">
                <span className="time-display">{formatTimeDisplay(openTime, '09:00 AM')}</span>
                <input 
                  type="time" 
                  id="openTime" 
                  className="time-native" 
                  value={openTime} 
                  onChange={(e) => setOpenTime(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="closeTime">เวลาปิด</label>
              <div className="time-wrap">
                <span className="time-display">{formatTimeDisplay(closeTime, '10:00 PM')}</span>
                <input 
                  type="time" 
                  id="closeTime" 
                  className="time-native" 
                  value={closeTime} 
                  onChange={(e) => setCloseTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* จำนวนพนักงาน */}
          <div className="field">
            <label className="field-label" htmlFor="staffCount">จำนวนพนักงาน</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M2.5 20C2.5 16.5 5 14 8 14C11 14 13.5 16.5 13.5 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M15 20C15 17.2 16.6 15.2 19 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </span>
              <input 
                type="number" 
                min="0" 
                id="staffCount" 
                placeholder="เช่น 5" 
                value={staffCount}
                onChange={(e) => setStaffCount(e.target.value)}
              />
              <span className="input-suffix">คน</span>
            </div>
          </div>

          {/* รายได้ต่อเดือน */}
          <div className="field">
            <label className="field-label">รายได้ต่อเดือน (โดยประมาณ)</label>
            <div className={`dropdown ${incomeDropdownOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="dropdown-trigger"
                onClick={() => {
                  setIncomeDropdownOpen(!incomeDropdownOpen);
                  setFoodTypeDropdownOpen(false);
                  setStockDropdownOpen(false);
                }}
              >
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="2.5" y="6" width="19" height="12" rx="2" stroke="currentColor" strokeWidth="1.7"/>
                    <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7"/>
                  </svg>
                </span>
                <span className={`dropdown-value ${income ? 'selected' : ''}`}>
                  {income ? {
                    lt50k: 'ต่ำกว่า 50,000 บาท',
                    '50-150k': '50,000 - 150,000 บาท',
                    '150-300k': '150,000 - 300,000 บาท',
                    '300-500k': '300,000 - 500,000 บาท',
                    gt500k: 'มากกว่า 500,000 บาท'
                  }[income] : 'ระบุช่วงรายได้'}
                </span>
                <svg className="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <ul className="dropdown-options">
                <li className={income === 'lt50k' ? 'selected' : ''} onClick={() => { setIncome('lt50k'); setIncomeDropdownOpen(false); }}>ต่ำกว่า 50,000 บาท</li>
                <li className={income === '50-150k' ? 'selected' : ''} onClick={() => { setIncome('50-150k'); setIncomeDropdownOpen(false); }}>50,000 - 150,000 บาท</li>
                <li className={income === '150-300k' ? 'selected' : ''} onClick={() => { setIncome('150-300k'); setIncomeDropdownOpen(false); }}>150,000 - 300,000 บาท</li>
                <li className={income === '300-500k' ? 'selected' : ''} onClick={() => { setIncome('300-500k'); setIncomeDropdownOpen(false); }}>300,000 - 500,000 บาท</li>
                <li className={income === 'gt500k' ? 'selected' : ''} onClick={() => { setIncome('gt500k'); setIncomeDropdownOpen(false); }}>มากกว่า 500,000 บาท</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Card 3: เทคโนโลยีและระบบ */}
        <section className="card">
          <div className="card-header">
            <span className="card-icon icon-gray">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="3" width="16" height="10" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
                <path d="M4 17H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M2 21H22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M4 17V13" stroke="currentColor" stroke-width="1.8"/>
                <path d="M20 17V13" stroke="currentColor" stroke-width="1.8"/>
              </svg>
            </span>
            <h2 className="card-title">เทคโนโลยีและระบบ</h2>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="posSystem">ระบบ POS ที่ใช้</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="13" rx="1.6" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M3 9H21" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M8 21H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <input 
                type="text" 
                id="posSystem" 
                placeholder="ระบุชื่อแบรนด์ POS (ถ้ามี)" 
                value={posSystem}
                onChange={(e) => setPosSystem(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label field-label--bold">วิธีการเช็คสต๊อก</label>
            <div className={`dropdown ${stockMethod ? 'selected' : ''} ${stockDropdownOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="dropdown-trigger"
                onClick={() => {
                  setStockDropdownOpen(!stockDropdownOpen);
                  setFoodTypeDropdownOpen(false);
                  setIncomeDropdownOpen(false);
                }}
              >
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="6" rx="1.4" stroke="currentColor" stroke-width="1.8"/>
                    <rect x="3" y="14" width="18" height="6" rx="1.4" stroke="currentColor" stroke-width="1.8"/>
                    <path d="M7 7H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    <path d="M7 17H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                </span>
                <span className={`dropdown-value ${stockMethod ? 'selected' : ''}`}>
                  {stockMethod ? {
                    manual: 'นับมือ / สมุดจด',
                    excel: 'Excel / Google Sheets',
                    'pos-integrated': 'ระบบ POS ในตัว',
                    'dedicated-app': 'แอปจัดการสต๊อกเฉพาะ',
                    none: 'ยังไม่มีระบบ'
                  }[stockMethod] : 'เลือกวิธีการเช็คสต๊อก'}
                </span>
                <svg className="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <ul className="dropdown-options">
                <li className={stockMethod === 'manual' ? 'selected' : ''} onClick={() => { setStockMethod('manual'); setStockDropdownOpen(false); }}>นับมือ / สมุดจด</li>
                <li className={stockMethod === 'excel' ? 'selected' : ''} onClick={() => { setStockMethod('excel'); setStockDropdownOpen(false); }}>Excel / Google Sheets</li>
                <li className={stockMethod === 'pos-integrated' ? 'selected' : ''} onClick={() => { setStockMethod('pos-integrated'); setStockDropdownOpen(false); }}>ระบบ POS ในตัว</li>
                <li className={stockMethod === 'dedicated-app' ? 'selected' : ''} onClick={() => { setStockMethod('dedicated-app'); setStockDropdownOpen(false); }}>แอปจัดการสต๊อกเฉพาะ</li>
                <li className={stockMethod === 'none' ? 'selected' : ''} onClick={() => { setStockMethod('none'); setStockDropdownOpen(false); }}>ยังไม่มีระบบ</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer / Button */}
      <footer className="footer">
        <button className="btn-primary" id="nextBtn" onClick={handleNextStep}>
          <span>ถัดไป</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </footer>

      {/* Toast Component */}
      <div className={`toast ${showToast ? 'show' : ''}`} id="toast">
        {toastMessage}
      </div>
    </div>
  );
}

export default App;