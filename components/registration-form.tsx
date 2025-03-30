'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from './ui/button';

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
      <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
        <h3 className="text-xl font-semibold text-green-800 mb-2">ลงทะเบียนสำเร็จ!</h3>
        <p className="text-green-700 mb-4">
          ขอบคุณสำหรับการลงทะเบียนเข้าร่วมการแข่งขัน "Pawn to Glory" เราจะติดต่อคุณทาง Discord เมื่อใกล้ถึงวันแข่งขัน
        </p>
        <Button
          onClick={() => setSuccess(false)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          ลงทะเบียนอีกครั้ง
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">ลงทะเบียนเข้าร่วมการแข่งขัน "Pawn to Glory"</h2>
      
      {error && (
        <div className="bg-red-50 p-3 rounded-md border border-red-200 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อ-นามสกุล
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="ชื่อ นามสกุล"
          />
        </div>
        
        <div>
          <label htmlFor="discordUsername" className="block text-sm font-medium text-gray-700 mb-1">
            Discord Username
          </label>
          <input
            type="text"
            id="discordUsername"
            name="discordUsername"
            required
            value={formData.discordUsername}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="username#0000"
          />
        </div>
        
        <div>
          <label htmlFor="chesscomUsername" className="block text-sm font-medium text-gray-700 mb-1">
            Chess.com Username
          </label>
          <input
            type="text"
            id="chesscomUsername"
            name="chesscomUsername"
            required
            value={formData.chesscomUsername}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="เช่น MagnusCarlsen"
          />
        </div>
        
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังส่งข้อมูล...
            </>
          ) : (
            'ลงทะเบียน'
          )}
        </Button>
      </form>
    </div>
  );
}