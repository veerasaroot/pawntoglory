'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type FormData = {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  total_rounds: number;
  time_control: string;
};

export default function CreateTournamentPage() {
  const initialFormData: FormData = {
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    total_rounds: 5,
    time_control: '15+10',
  };
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'total_rounds' ? parseInt(value) : value,
    }));
    
    // Clear error for this field
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'กรุณาระบุชื่อการแข่งขัน';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'กรุณาระบุวันที่เริ่มการแข่งขัน';
    }
    
    if (!formData.registration_deadline) {
      newErrors.registration_deadline = 'กรุณาระบุวันสิ้นสุดการลงทะเบียน';
    }
    
    // Check if registration deadline is before start date
    if (formData.registration_deadline && formData.start_date) {
      const regDeadline = new Date(formData.registration_deadline);
      const startDate = new Date(formData.start_date);
      
      if (regDeadline > startDate) {
        newErrors.registration_deadline = 'วันสิ้นสุดการลงทะเบียนต้องมาก่อนวันที่เริ่มการแข่งขัน';
      }
    }
    
    // Check if end date is after start date
    if (formData.end_date && formData.start_date) {
      const endDate = new Date(formData.end_date);
      const startDate = new Date(formData.start_date);
      
      if (endDate < startDate) {
        newErrors.end_date = 'วันที่สิ้นสุดการแข่งขันต้องมาหลังวันที่เริ่มการแข่งขัน';
      }
    }
    
    // Validate total rounds
    if (formData.total_rounds < 1) {
      newErrors.total_rounds = 'จำนวนรอบต้องมากกว่า 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create tournament
      const { data: tournament, error } = await supabase
        .from('tournaments')
        .insert({
          name: formData.name,
          description: formData.description,
          start_date: formData.start_date,
          end_date: formData.end_date,
          registration_deadline: formData.registration_deadline,
          total_rounds: formData.total_rounds,
          time_control: formData.time_control,
          status: 'upcoming',
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Redirect to tournament page
      router.push(`/admin/tournaments/${tournament.id}`);
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('เกิดข้อผิดพลาดในการสร้างการแข่งขัน');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/admin"
            className="text-blue-600 hover:underline"
          >
            แผงควบคุม
          </Link>
          <span className="text-gray-500">{'>'}</span>
          <span className="font-medium">สร้างการแข่งขันใหม่</span>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800">สร้างการแข่งขันใหม่</h1>
            <p className="text-gray-600 mt-1">กรอกข้อมูลเพื่อสร้างการแข่งขัน Pawn to Glory</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  ชื่อการแข่งขัน <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  รายละเอียดการแข่งขัน
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    วันที่เริ่มการแข่งขัน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      errors.start_date ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.start_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                    วันที่สิ้นสุดการแข่งขัน
                  </label>
                  <input
                    type="datetime-local"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      errors.end_date ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.end_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="registration_deadline" className="block text-sm font-medium text-gray-700">
                  วันสิ้นสุดการลงทะเบียน <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="registration_deadline"
                  name="registration_deadline"
                  value={formData.registration_deadline}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    errors.registration_deadline ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.registration_deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.registration_deadline}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="total_rounds" className="block text-sm font-medium text-gray-700">
                    จำนวนรอบทั้งหมด
                  </label>
                  <input
                    type="number"
                    id="total_rounds"
                    name="total_rounds"
                    min="1"
                    max="20"
                    value={formData.total_rounds}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      errors.total_rounds ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.total_rounds && (
                    <p className="mt-1 text-sm text-red-600">{errors.total_rounds}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="time_control" className="block text-sm font-medium text-gray-700">
                    การควบคุมเวลา
                  </label>
                  <select
                    id="time_control"
                    name="time_control"
                    value={formData.time_control}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="3+2">3+2 (Blitz)</option>
                    <option value="5+0">5+0 (Blitz)</option>
                    <option value="5+3">5+3 (Blitz)</option>
                    <option value="10+0">10+0 (Rapid)</option>
                    <option value="10+5">10+5 (Rapid)</option>
                    <option value="15+10">15+10 (Rapid)</option>
                    <option value="30+0">30+0 (Classical)</option>
                    <option value="30+30">30+30 (Classical)</option>
                    <option value="60+30">60+30 (Classical)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition mr-3"
              >
                ยกเลิก
              </Link>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 rounded text-white ${
                  isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังสร้าง...
                  </div>
                ) : (
                  'สร้างการแข่งขัน'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}