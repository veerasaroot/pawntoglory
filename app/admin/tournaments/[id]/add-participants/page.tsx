'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

type Participant = {
  id: string;
  name: string;
  discord_username: string;
  chesscom_username: string;
  status: string;
  created_at: string;
  alreadyAdded?: boolean;
};

export default function AddParticipantsPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch tournament name
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('name')
        .eq('id', tournamentId)
        .single();
        
      if (tournamentError) {
        console.error('Error fetching tournament:', tournamentError);
        return;
      }
      
      setTournamentName(tournamentData.name);
      
      // Fetch approved participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('status', 'approved')
        .order('name', { ascending: true });
        
      if (participantsError) {
        console.error('Error fetching participants:', participantsError);
        setIsLoading(false);
        return;
      }
      
      // Fetch existing tournament participants
      const { data: tournamentParticipantsData, error: tournamentParticipantsError } = await supabase
        .from('tournament_participants')
        .select('participant_id')
        .eq('tournament_id', tournamentId);
        
      if (tournamentParticipantsError) {
        console.error('Error fetching tournament participants:', tournamentParticipantsError);
      }
      
      // Mark already added participants
      const existingParticipantIds = tournamentParticipantsData?.map(tp => tp.participant_id) || [];
      
      const processedParticipants = participantsData.map(participant => ({
        ...participant,
        alreadyAdded: existingParticipantIds.includes(participant.id)
      }));
      
      setParticipants(processedParticipants);
      setIsLoading(false);
    };
    
    fetchData();
  }, [supabase, tournamentId]);
  
  const handleSelectParticipant = (participantId: string) => {
    setSelectedParticipants(prev => {
      if (prev.includes(participantId)) {
        return prev.filter(id => id !== participantId);
      } else {
        return [...prev, participantId];
      }
    });
  };
  
  const handleSelectAll = () => {
    const availableParticipants = participants
      .filter(p => !p.alreadyAdded)
      .map(p => p.id);
      
    if (selectedParticipants.length === availableParticipants.length) {
      // Deselect all if all are selected
      setSelectedParticipants([]);
    } else {
      // Select all available participants
      setSelectedParticipants(availableParticipants);
    }
  };
  
  const handleSubmit = async () => {
    if (selectedParticipants.length === 0) {
      alert('กรุณาเลือกผู้เข้าแข่งขันอย่างน้อย 1 คน');
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare data to insert
    const participantsToAdd = selectedParticipants.map(participantId => ({
      tournament_id: tournamentId,
      participant_id: participantId,
      score: 0,
      tiebreak_1: 0,
      tiebreak_2: 0,
      status: 'active'
    }));
    
    // Insert into tournament_participants
    const { error } = await supabase
      .from('tournament_participants')
      .insert(participantsToAdd);
      
    if (error) {
      console.error('Error adding participants:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มผู้เข้าแข่งขัน');
      setIsSubmitting(false);
      return;
    }
    
    // Redirect back to tournament page
    router.push(`/admin/tournaments/${tournamentId}`);
  };
  
  const filteredParticipants = participants.filter(participant => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      participant.name.toLowerCase().includes(query) ||
      participant.discord_username.toLowerCase().includes(query) ||
      participant.chesscom_username.toLowerCase().includes(query)
    );
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/admin"
            className="text-blue-600 hover:underline"
          >
            แผงควบคุม
          </Link>
          <span className="text-gray-500">{'>'}</span>
          <Link
            href={`/admin/tournaments/${tournamentId}`}
            className="text-blue-600 hover:underline"
          >
            {tournamentName}
          </Link>
          <span className="text-gray-500">{'>'}</span>
          <span className="font-medium">เพิ่มผู้เข้าแข่งขัน</span>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800">เพิ่มผู้เข้าแข่งขัน</h1>
            <p className="text-gray-600 mt-1">เลือกผู้เล่นที่ต้องการเพิ่มเข้าการแข่งขัน "{tournamentName}"</p>
          </div>
          
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="ค้นหาผู้เข้าแข่งขัน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition"
                >
                  {selectedParticipants.length === participants.filter(p => !p.alreadyAdded).length
                    ? 'ยกเลิกการเลือกทั้งหมด'
                    : 'เลือกทั้งหมด'}
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={selectedParticipants.length === 0 || isSubmitting}
                  className={`px-4 py-2 rounded ${
                    selectedParticipants.length === 0 || isSubmitting
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'กำลังเพิ่ม...' : `เพิ่ม (${selectedParticipants.length})`}
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    <input
                      type="checkbox"
                      checked={
                        selectedParticipants.length > 0 &&
                        selectedParticipants.length === participants.filter(p => !p.alreadyAdded).length
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discord</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chess.com</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      ไม่พบผู้เข้าแข่งขันที่ตรงกับการค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((participant) => (
                    <tr key={participant.id} className={`hover:bg-gray-50 ${participant.alreadyAdded ? 'bg-gray-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(participant.id)}
                          onChange={() => handleSelectParticipant(participant.id)}
                          disabled={participant.alreadyAdded}
                          className="h-4 w-4 text-blue-600 rounded disabled:opacity-50"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {participant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.discord_username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {participant.chesscom_username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {participant.alreadyAdded ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            เพิ่มแล้ว
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            พร้อม
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 flex justify-between items-center bg-gray-50">
            <p className="text-sm text-gray-600">
              ผู้เข้าแข่งขันทั้งหมด: {participants.length}, เลือกแล้ว: {selectedParticipants.length}
            </p>
            
            <div className="flex gap-2">
              <Link
                href={`/admin/tournaments/${tournamentId}`}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition"
              >
                ยกเลิก
              </Link>
              
              <button
                onClick={handleSubmit}
                disabled={selectedParticipants.length === 0 || isSubmitting}
                className={`px-4 py-2 rounded ${
                  selectedParticipants.length === 0 || isSubmitting
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มผู้เข้าแข่งขัน'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}