// src/app/page.tsx
import ChessLayout from '@/components/layout/ChessLayout';
import RegistrationForm from '@/components/registration-form';
import Image from 'next/image';

export default function Home() {
  return (
    <ChessLayout showHero={true}>
      <div className="mt-12 mb-20">
        {/* Features Section */}
        <div className="relative mb-24">
          {/* Chess board pattern background */}
          <div className="absolute inset-0 bg-chess-pattern opacity-5 z-0"></div>
          
          <div className="relative z-10 py-12">
            <h2 className="text-3xl font-bold text-chess-gold text-center font-serif mb-2">การแข่งขันระดับโลก</h2>
            <p className="text-chess-text-muted text-center max-w-2xl mx-auto mb-12">
              เตรียมพบกับประสบการณ์การแข่งขันหมากรุกออนไลน์ที่สมบูรณ์แบบ
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-chess-dark p-6 rounded-chess shadow-chess hover:shadow-chess-hover transform hover:-translate-y-1 transition-all">
                <div className="rounded-full bg-chess-gold bg-opacity-20 w-16 h-16 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-chess-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,3c-0.5,0-1,0.5-1,1v2H9V4c0-0.5-0.5-1-1-1s-1,0.5-1,1v2c0,1.7,1.3,3,3,3 c1.7,0,3-1.3,3-3V4C13,3.5,12.5,3,12,3z M18,15v-3c0-0.6-0.4-1-1-1s-1,0.4-1,1v3h-1.5c-0.8,0-1.5,0.7-1.5,1.5v0c0,0.8,0.7,1.5,1.5,1.5h1.5v2 c0,0.6,0.4,1,1,1s1-0.4,1-1v-2h1.5c0.8,0,1.5-0.7,1.5-1.5v0c0-0.8-0.7-1.5-1.5-1.5H18z M6,4c0-0.5-0.5-1-1-1S4,3.5,4,4v4c0,1.7,1.3,3,3,3 c1.7,0,3-1.3,3-3V7h2c0.6,0,1-0.4,1-1s-0.4-1-1-1H10V4c0-0.5-0.5-1-1-1S8,3.5,8,4v1H6V4z M20,20H4c-0.6,0-1,0.4-1,1s0.4,1,1,1h16 c0.6,0,1-0.4,1-1S20.6,20,20,20z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-chess-gold mb-2 font-serif">Swiss Pairing</h3>
                <p className="text-chess-text-muted">
                  ระบบการจับคู่แบบ Swiss ที่มีมาตรฐาน พบกับคู่แข่งที่มีระดับฝีมือใกล้เคียงกัน เพื่อการแข่งขันที่สนุกและท้าทาย
                </p>
              </div>
              
              <div className="bg-chess-dark p-6 rounded-chess shadow-chess hover:shadow-chess-hover transform hover:-translate-y-1 transition-all">
                <div className="rounded-full bg-chess-gold bg-opacity-20 w-16 h-16 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-chess-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M16.2,16.2L11,13V7h1.5v5.2l4.5,2.7L16.2,16.2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-chess-gold mb-2 font-serif">เวลาที่สมดุล</h3>
                <p className="text-chess-text-muted">
                  ระบบเวลา 10+0 (10 นาที + 0 วินาทีต่อการเดิน) ที่เหมาะสมสำหรับการวางแผนเชิงกลยุทธ์ แต่ยังคงกดดันด้วยเวลาที่จำกัด
                </p>
              </div>
              
              <div className="bg-chess-dark p-6 rounded-chess shadow-chess hover:shadow-chess-hover transform hover:-translate-y-1 transition-all">
                <div className="rounded-full bg-chess-gold bg-opacity-20 w-16 h-16 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-chess-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7,15h3c0.6,0,1-0.4,1-1v-1H9c-1.1,0-2-0.9-2-2V9c0-1.1,0.9-2,2-2h2c1.1,0,2,0.9,2,2v4c0,1.1-0.9,2-2,2H7c-0.6,0-1,0.4-1,1 S6.4,15,7,15z M9,9v2h2V9H9z M13,9h2v6h-2V9z M18,9h1c0.6,0,1-0.4,1-1s-0.4-1-1-1h-1c-1.1,0-2,0.9-2,2v4c0,1.1,0.9,2,2,2h1 c0.6,0,1-0.4,1-1s-0.4-1-1-1h-1V9z M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8 s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-chess-gold mb-2 font-serif">รางวัลที่น่าดึงดูด</h3>
                <p className="text-chess-text-muted">
                  ตัวหมากรุกสุดแรร์ แต่ก็ยังต้องรอเซอร์ไพรส์นะ!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tournament Info & Registration */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-chess-dark p-8 rounded-chess shadow-chess">
            <h2 className="text-2xl font-bold text-chess-gold mb-4 font-serif">รายละเอียดการแข่งขัน</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center text-lg font-semibold text-chess-gold mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  รูปแบบการแข่งขัน
                </h3>
                <p className="text-chess-text-muted ml-7">
                  Swiss Pairing ทั้งหมด 5 รอบ การแข่งแต่ละรอบใช้เวลา 10+0 (10 นาที + 0 วินาทีต่อการเดิน)
                </p>
              </div>
              
              <div>
                <h3 className="flex items-center text-lg font-semibold text-chess-gold mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  กำหนดการ
                </h3>
                <ul className="text-chess-text-muted ml-7 space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 mt-1 mr-2 rounded-full border border-chess-gold"></span>
                    <span>วันที่แข่งขัน: 4 เมษายน 2025</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 mt-1 mr-2 rounded-full border border-chess-gold"></span>
                    <span>เวลาลงทะเบียน: 19:00 - 19:29 น.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 mt-1 mr-2 rounded-full border border-chess-gold"></span>
                    <span>เริ่มแข่งรอบแรก: 19:30 น.</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center text-lg font-semibold text-chess-gold mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  รางวัล
                </h3>
                <ul className="text-chess-text-muted ml-7 space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 mt-1 mr-2 rounded-full bg-chess-gold"></span>
                    <span>อันดับ 1: ตัวหมากรุกสุดเท่ แรร์และล่ำค่า</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 mt-1 mr-2 rounded-full bg-chess-silver"></span>
                    <span>อันดับ 2: รอลุ้น</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 mt-1 mr-2 rounded-full bg-chess-bronze"></span>
                    <span>อันดับ 3: รอลุ้น</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center text-lg font-semibold text-chess-gold mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  การติดต่อ
                </h3>
                <p className="text-chess-text-muted ml-7">
                  สำหรับข้อสงสัยเพิ่มเติม สามารถติดต่อได้ทาง Discord: <a className="text-chess-gold" href="https://discord.gg/pphB5MJg">https://discord.gg/pphB5MJg</a>
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <div className="relative w-full h-48 md:h-64 rounded-chess overflow-hidden">
                <Image
                  src="/images/chess-tournament.png"
                  alt="การแข่งขันหมากรุก"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          
          <div>
            <RegistrationForm />
          </div>
        </div>
        
        {/* Testimonials */}
        {/* <div className="mt-24">
          <h2 className="text-3xl font-bold text-chess-gold text-center font-serif mb-2">ความประทับใจจากผู้เข้าแข่งขัน</h2>
          <p className="text-chess-text-muted text-center max-w-2xl mx-auto mb-12">
            เสียงตอบรับจากผู้เข้าร่วมการแข่งขันในรายการก่อนหน้า
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-chess-dark p-6 rounded-chess shadow-chess relative">
              <div className="absolute -top-4 left-6">
                <div className="w-8 h-8 bg-chess-gold rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-chess-dark" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.983,3V5.003H7.98V8.002H9.983V10H5.971V5.003H7.98V3H3.987V16.005H9.983V10H7.98V8.002H9.983V5.003H7.98V3H9.983M16.001,3V8.002H18.004V3H20.006V16.005H18.004V10H16.001V16.005H13.999V3H16.001Z"/>
                  </svg>
                </div>
              </div>
              <p className="text-chess-text-muted mb-4 pt-4">
                "การจัดการแข่งขันเป็นระบบมาก การจับคู่แบบ Swiss ทำให้ได้พบกับคู่แข่งที่มีระดับใกล้เคียงกัน สนุกและได้เรียนรู้เยอะมาก"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-chess-black flex items-center justify-center mr-3">
                  <span className="text-chess-gold font-bold">ธ</span>
                </div>
                <div>
                  <h4 className="font-medium text-chess-gold">ธนกร วิชัยวงศ์</h4>
                  <p className="text-xs text-chess-text-muted">อันดับ 2 รายการ "Knight's Challenge 2024"</p>
                </div>
              </div>
            </div>
            
            <div className="bg-chess-dark p-6 rounded-chess shadow-chess relative">
              <div className="absolute -top-4 left-6">
                <div className="w-8 h-8 bg-chess-gold rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-chess-dark" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.983,3V5.003H7.98V8.002H9.983V10H5.971V5.003H7.98V3H3.987V16.005H9.983V10H7.98V8.002H9.983V5.003H7.98V3H9.983M16.001,3V8.002H18.004V3H20.006V16.005H18.004V10H16.001V16.005H13.999V3H16.001Z"/>
                  </svg>
                </div>
              </div>
              <p className="text-chess-text-muted mb-4 pt-4">
                "บรรยากาศดีมาก เจ้าหน้าที่เป็นมิตร ระบบทำงานได้ราบรื่น ชอบมากที่มีการอัพเดตคะแนนแบบเรียลไทม์"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-chess-black flex items-center justify-center mr-3">
                  <span className="text-chess-gold font-bold">น</span>
                </div>
                <div>
                  <h4 className="font-medium text-chess-gold">นภา รักการเล่น</h4>
                  <p className="text-xs text-chess-text-muted">ผู้เข้าแข่งขันรายการ "Bishop's Battle 2023"</p>
                </div>
              </div>
            </div>
            
            <div className="bg-chess-dark p-6 rounded-chess shadow-chess relative">
              <div className="absolute -top-4 left-6">
                <div className="w-8 h-8 bg-chess-gold rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-chess-dark" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.983,3V5.003H7.98V8.002H9.983V10H5.971V5.003H7.98V3H3.987V16.005H9.983V10H7.98V8.002H9.983V5.003H7.98V3H9.983M16.001,3V8.002H18.004V3H20.006V16.005H18.004V10H16.001V16.005H13.999V3H16.001Z"/>
                  </svg>
                </div>
              </div>
              <p className="text-chess-text-muted mb-4 pt-4">
                "เป็นรายการที่ทำให้ผมได้พัฒนาฝีมือและได้พบเพื่อนใหม่ๆ ที่มีใจรักในหมากรุกเหมือนกัน จะกลับมาร่วมแข่งขันอีกแน่นอน"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-chess-black flex items-center justify-center mr-3">
                  <span className="text-chess-gold font-bold">ส</span>
                </div>
                <div>
                  <h4 className="font-medium text-chess-gold">สมชาย ใจดี</h4>
                  <p className="text-xs text-chess-text-muted">ชนะเลิศรายการ "Queen's Quest 2024"</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* Call to Action */}
        <div className="mt-20 bg-chess-dark rounded-chess shadow-chess p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-chess-pattern opacity-5"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-chess-gold font-serif mb-4">พร้อมที่จะร่วมแข่งขันหรือยัง?</h2>
            <p className="text-chess-text-muted max-w-2xl mx-auto mb-8">
              อย่าพลาดโอกาสในการแสดงฝีมือหมากรุกของคุณและเป็นส่วนหนึ่งของชุมชนผู้รักกีฬาหมากรุก
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-chess-gold hover:bg-chess-bronze text-chess-dark px-8 py-3 rounded-chess font-medium transition-colors shadow-chess hover:shadow-chess-hover">
                ลงทะเบียนเข้าร่วมแข่งขัน
              </button>
              <button className="bg-transparent hover:bg-chess-black text-chess-gold border-2 border-chess-gold px-8 py-3 rounded-chess font-medium transition-colors">
                ดูกฎกติกาเพิ่มเติม
              </button>
            </div>
          </div>
        </div>
      </div>
    </ChessLayout>
  );
}