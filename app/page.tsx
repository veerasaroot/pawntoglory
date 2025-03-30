import RegistrationForm from '@/components/registration-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3 text-center">
            Pawn to Glory
          </h1>
          <p className="text-lg text-blue-700 mb-6 text-center">
            การแข่งขันหมากรุกออนไลน์สำหรับทุกระดับฝีมือ
          </p>
          <div className="w-20 h-1 bg-blue-500 rounded mb-8"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">รายละเอียดการแข่งขัน</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-700">รูปแบบการแข่งขัน</h3>
                <p className="text-gray-700">
                  Swiss Pairing ทั้งหมด 5 รอบ การแข่งแต่ละรอบใช้เวลา 15+10 (15 นาที + 10 วินาทีต่อการเดิน)
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-700">กำหนดการ</h3>
                <ul className="list-disc ml-5 text-gray-700">
                  <li>วันที่แข่งขัน: 15 เมษายน 2025</li>
                  <li>เวลาลงทะเบียน: 09:00 - 09:45 น.</li>
                  <li>เริ่มแข่งรอบแรก: 10:00 น.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-700">รางวัล</h3>
                <ul className="list-disc ml-5 text-gray-700">
                  <li>อันดับ 1: โล่รางวัล + เงินรางวัล 3,000 บาท</li>
                  <li>อันดับ 2: เงินรางวัล 2,000 บาท</li>
                  <li>อันดับ 3: เงินรางวัล 1,000 บาท</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-700">การติดต่อ</h3>
                <p className="text-gray-700">
                  สำหรับข้อสงสัยเพิ่มเติม สามารถติดต่อได้ทาง Discord: ChessTournament#1234
                </p>
              </div>
            </div>
          </div>

          <div>
            <RegistrationForm />
          </div>
        </div>
      </div>
    </main>
  );
}