'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

type Tournament = {
  id: string;
  name: string;
  status: string;
  start_date: string;
  total_rounds: number;
  participant_count?: number;
};

type Participant = {
  id: string;
  name: string;
  discord_username: string;
  chesscom_username: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Check if user is authenticated and an admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redirect to login if not authenticated
        window.location.href = '/admin/login';
        return;
      }
      
      // Fetch tournaments
      const { data: tournamentsData, error: tournamentsError } = await supabase
        .from('tournaments')
        .select('id, name, status, start_date, total_rounds');
        
      if (tournamentsError) {
        console.error('Error fetching tournaments:', tournamentsError);
      } else {
        // Get participant count for each tournament
        const tournamentWithCounts = await Promise.all(
          tournamentsData.map(async (tournament) => {
            const { count } = await supabase
              .from('tournament_participants')
              .select('*', { count: 'exact', head: true })
              .eq('tournament_id', tournament.id);
              
            return {
              ...tournament,
              participant_count: count || 0
            };
          })
        );
        
        setTournaments(tournamentWithCounts);
      }
      
      // Fetch pending participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (participantsError) {
        console.error('Error fetching participants:', participantsError);
      } else {
        setParticipants(participantsData);
        setPendingCount(participantsData.length);
      }
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [supabase]);
  
  const handleApproveParticipant = async (id: string) => {
    const { error } = await supabase
      .from('participants')
      .update({ status: 'approved' })
      .eq('id', id);
      
    if (error) {
      console.error('Error approving participant:', error);
    } else {
      // Update local state
      setParticipants(participants.filter(p => p.id !== id));
      setPendingCount(pendingCount - 1);
    }
  };
  
  const handleRejectParticipant = async (id: string) => {
    const { error } = await supabase
      .from('participants')
      .update({ status: 'rejected' })
      .eq('id', id);
      
    if (error) {
      console.error('Error rejecting participant:', error);
    } else {
      // Update local state
      setParticipants(participants.filter(p => p.id !== id));
      setPendingCount(pendingCount - 1);
    }
  };
  
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">แผงควบคุมผู้ดูแลระบบ</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition"
          >
            กลับหน้าหลัก
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">การแข่งขันทั้งหมด</h2>
            <p className="text-3xl font-bold text-blue-600">{tournaments.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">การลงทะเบียนรอการอนุมัติ</h2>
            <p className="text-3xl font-bold text-orange-500">{pendingCount}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">ผู้เข้าแข่งขันทั้งหมด</h2>
            <p className="text-3xl font-bold text-green-600">
              {tournaments.reduce((acc, tournament) => acc + (tournament.participant_count || 0), 0)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">การแข่งขันล่าสุด</h2>
              <Link
                href="/admin/tournaments"
                className="text-sm text-blue-600 hover:underline"
              >
                ดูทั้งหมด
              </Link>
            </div>
            
            <div className="p-6">
              {tournaments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">ไม่มีการแข่งขันในขณะนี้</p>
              ) : (
                <div className="divide-y">
                  {tournaments.slice(0, 5).map((tournament) => (
                    <div key={tournament.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{tournament.name}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(tournament.start_date).toLocaleDateString('th-TH')} - {tournament.total_rounds} รอบ
                          </p>
                        </div>
                        <div>
                          <span className={`inline-block px-2 py-1 text-xs rounded ${
                            tournament.status === 'active' ? 'bg-green-100 text-green-800' :
                            tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {tournament.status === 'active' ? 'กำลังแข่งขัน' :
                             tournament.status === 'upcoming' ? 'กำลังจะมาถึง' :
                             'เสร็จสิ้น'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span className="text-sm text-gray-600">
                          ผู้เข้าแข่งขัน: {tournament.participant_count || 0}
                        </span>
                        <Link
                          href={`/admin/tournaments/${tournament.id}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          จัดการ
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">การลงทะเบียนที่รออนุมัติ</h2>
              <Link
                href="/admin/participants"
                className="text-sm text-blue-600 hover:underline"
              >
                ดูทั้งหมด
              </Link>
            </div>
            
            <div className="p-6">
              {participants.length === 0 ? (
                <p className="text-gray-500 text-center py-4">ไม่มีการลงทะเบียนที่รออนุมัติ</p>
              ) : (
                <div className="divide-y">
                  {participants.slice(0, 5).map((participant) => (
                    <div key={participant.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{participant.name}</h3>
                          <p className="text-sm text-gray-500">
                            Discord: {participant.discord_username}
                          </p>
                          <p className="text-sm text-gray-500">
                            Chess.com: {participant.chesscom_username}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(participant.created_at).toLocaleDateString('th-TH')}
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => handleApproveParticipant(participant.id)}
                          className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded text-sm transition"
                        >
                          อนุมัติ
                        </button>
                        <button
                          onClick={() => handleRejectParticipant(participant.id)}
                          className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm transition"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/tournaments/new"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg shadow text-center transition"
          >
            <span className="font-medium">+ สร้างการแข่งขันใหม่</span>
          </Link>
          
          <Link
            href="/admin/participants"
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg shadow text-center transition"
          >
            <span className="font-medium">จัดการผู้เข้าแข่งขัน</span>
          </Link>
        </div>
      </div>
    </div>
  );
}