'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Pairing = {
  id: string;
  whiteId: string;
  whiteName: string;
  whiteUsername: string;
  blackId: string;
  blackName: string;
  blackUsername: string;
  result: string | null;
  boardNumber: number;
};

type PairingTableProps = {
  pairings: Pairing[];
  roundId: string;
  isActive: boolean;
  onResultUpdate?: (pairingId: string, result: string) => void;
};

export default function PairingTable({ pairings, roundId, isActive, onResultUpdate }: PairingTableProps) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const supabase = createClientComponentClient();

  const handleResultChange = async (pairingId: string, result: string) => {
    if (!isActive) return;
    
    setLoading(prev => ({ ...prev, [pairingId]: true }));
    
    try {
      if (onResultUpdate) {
        onResultUpdate(pairingId, result);
      } else {
        const { error } = await supabase
          .from('pairings')
          .update({ result })
          .eq('id', pairingId);
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating result:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกผลลัพธ์');
    } finally {
      setLoading(prev => ({ ...prev, [pairingId]: false }));
    }
  };

  const getResultText = (result: string | null): string => {
    switch (result) {
      case '1-0': return 'ขาวชนะ';
      case '0-1': return 'ดำชนะ';
      case '1/2-1/2': return 'เสมอ';
      case '0-0': return 'ยกเลิก';
      default: return '-';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">กระดาน</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ขาว</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ดำ</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผลลัพธ์</th>
            {isActive && (
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pairings.length === 0 ? (
            <tr>
              <td colSpan={isActive ? 5 : 4} className="px-4 py-2 text-center text-gray-500">
                ไม่มีการจับคู่
              </td>
            </tr>
          ) : (
            pairings.map((pairing) => (
              <tr key={pairing.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {pairing.boardNumber}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {pairing.whiteName} 
                  <span className="text-xs text-gray-500 ml-1">({pairing.whiteUsername})</span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {pairing.blackName}
                  <span className="text-xs text-gray-500 ml-1">({pairing.blackUsername})</span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {getResultText(pairing.result)}
                </td>
                {isActive && (
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <select
                        value={pairing.result || ''}
                        onChange={(e) => handleResultChange(pairing.id, e.target.value)}
                        disabled={loading[pairing.id]}
                        className="border rounded px-2 py-1 text-sm disabled:opacity-50"
                      >
                        <option value="">เลือกผลลัพธ์</option>
                        <option value="1-0">ขาวชนะ</option>
                        <option value="0-1">ดำชนะ</option>
                        <option value="1/2-1/2">เสมอ</option>
                        <option value="0-0">ยกเลิก</option>
                      </select>
                      
                      {loading[pairing.id] && (
                        <div className="ml-2 animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}