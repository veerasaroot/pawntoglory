'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';

type FormData = {
  name: string;
  discordUsername: string;
  chesscomUsername: string;
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    discordUsername: '',
    chesscomUsername: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClientComponentClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('participants')
        .insert([
          {
            name: formData.name,
            discord_username: formData.discordUsername,
            chesscom_username: formData.chesscomUsername,
            status: 'pending',
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
      
      setSuccess(true);
      setFormData({
        name: '',
        discordUsername: '',
        chesscomUsername: '',
      });
    } catch (err) {
      console.error('Error registering:', err);
      setError('เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-chess-dark p-8 rounded-chess shadow-chess border border-chess-gold text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <Image
            src="/images/checkmark.svg"
            alt="Success"
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-2xl font-semibold text-chess-gold font-serif mb-3">ลงทะเบียนสำเร็จ!</h3>
        <p className="text-chess-text-muted mb-6">
          ขอบคุณสำหรับการลงทะเบียนเข้าร่วมการแข่งขัน "Pawn to Glory" <br />
          เราจะติดต่อคุณทาง Discord เมื่อใกล้ถึงวันแข่งขัน
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-chess-gold hover:bg-chess-bronze text-chess-dark font-medium py-2 px-6 rounded-chess transition-colors shadow-chess hover:shadow-chess-hover"
        >
          ลงทะเบียนอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="bg-chess-dark p-8 rounded-chess shadow-chess border border-chess-black animate-fade-in">
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-10 h-10 mr-3">
          <Image 
            src="/images/chess-pawn.svg"
            alt="Pawn Icon"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-chess-gold font-serif">ลงทะเบียนเข้าร่วมการแข่งขัน</h2>
      </div>
      
      {error && (
        <div className="bg-chess-red/20 p-4 rounded-chess border border-chess-red mb-6">
          <p className="text-chess-red text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-chess-text-muted mb-1">
            ชื่อ-นามสกุล <span className="text-chess-red">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-chess-silver" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="bg-chess-bg border border-chess-black text-chess-text rounded-chess w-full pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-chess-gold focus:border-chess-gold"
              placeholder="ชื่อ นามสกุล"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="discordUsername" className="block text-sm font-medium text-chess-text-muted mb-1">
            Discord Username <span className="text-chess-red">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-chess-silver" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <input
              type="text"
              id="discordUsername"
              name="discordUsername"
              required
              value={formData.discordUsername}
              onChange={handleChange}
              className="bg-chess-bg border border-chess-black text-chess-text rounded-chess w-full pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-chess-gold focus:border-chess-gold"
              placeholder="username#0000"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="chesscomUsername" className="block text-sm font-medium text-chess-text-muted mb-1">
            Chess.com Username <span className="text-chess-red">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-chess-silver" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.484 8.563L12 1.993L3.516 8.563L4.484 9.781L5.25 9.187V21H18.75V9.187L19.516 9.781L20.484 8.563ZM16.594 10.781H15.188V7.969H14.062V10.781H12.562V7.969H11.438V10.781H9.938V7.969H8.812V10.781H7.406L7.5 7.219L12 3.937L16.5 7.219L16.594 10.781Z"/>
              </svg>
            </div>
            <input
              type="text"
              id="chesscomUsername"
              name="chesscomUsername"
              required
              value={formData.chesscomUsername}
              onChange={handleChange}
              className="bg-chess-bg border border-chess-black text-chess-text rounded-chess w-full pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-chess-gold focus:border-chess-gold"
              placeholder="เช่น MagnusCarlsen"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-chess-gold hover:bg-chess-bronze text-chess-dark font-medium py-3 px-4 rounded-chess transition-colors shadow-chess hover:shadow-chess-hover flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-chess-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังส่งข้อมูล...
            </>
          ) : (
            'ลงทะเบียน'
          )}
        </button>
        
        <p className="text-xs text-chess-text-muted text-center mt-4">
          เมื่อลงทะเบียน คุณยอมรับ <a href="#" className="text-chess-gold hover:underline">กฎกติกาการแข่งขัน</a> และ <a href="#" className="text-chess-gold hover:underline">นโยบายความเป็นส่วนตัว</a> ของเรา
        </p>
      </form>
    </div>
  );
}