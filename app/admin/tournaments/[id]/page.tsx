'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { generateSwissPairings } from '@/lib/swiss-algorithm';

type Tournament = {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  total_rounds: number;
  time_control: string;
};

type Participant = {
  id: string;
  participant_id: string;
  name: string;
  chesscom_username: string;
  score: number;
  tiebreak_1: number;
  tiebreak_2: number;
};

type Round = {
  id: string;
  round_number: number;
  start_time: string;
  end_time: string;
  status: string;
};

type Pairing = {
  id: string;
  white_id: string;
  white_name: string;
  white_username: string;
  black_id: string;
  black_name: string;
  black_username: string;
  result: string | null;
  board_number: number;
};

type ParticipantData = {
  name: string;
  chesscom_username: string;
};

type TournamentParticipantData = {
  id: string;
  participant: ParticipantData | ParticipantData[];
};

type PairingData = {
  id: string;
  white_id: string | null;
  black_id: string | null;
  result: string | null;
  board_number: number;
  white_player: TournamentParticipantData | TournamentParticipantData[] | null;
  black_player: TournamentParticipantData | TournamentParticipantData[] | null;
};

type PreviousPairingData = {
  id: string;
  white_id: string;
  black_id: string;
  result: string | null;
  round: {
    round_number: number;
  };
};

export default function TournamentDetail() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabView, setTabView] = useState<'standings' | 'rounds' | 'participants'>('standings');

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchTournamentData = async () => {
      setIsLoading(true);

      // Fetch tournament details
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (tournamentError) {
        console.error('Error fetching tournament:', tournamentError);
        return;
      }

      setTournament(tournamentData);

      // Fetch participants with their scores
      // แก้ไข: Fetch participants with their scores - ไม่ใช้ alias
      const { data: participantsData, error: participantsError } = await supabase
        .from('tournament_standings')
        .select(`
    tournament_participant_id,
    participant_id,
    participant_name,
    chesscom_username,
    score,
    buchholz,
    sonneborn_berger
  `)
        .eq('tournament_id', tournamentId)
        .order('score', { ascending: false })
        .order('buchholz', { ascending: false })
        .order('sonneborn_berger', { ascending: false });

      if (participantsError) {
        console.error('Error fetching participants:', participantsError);
      } else {
        // แก้ไข: แปลงข้อมูลให้ตรงกับ type Participant
        const formattedParticipants = participantsData
          ? participantsData.map(p => ({
            id: p.tournament_participant_id,
            participant_id: p.participant_id,
            name: p.participant_name,
            chesscom_username: p.chesscom_username,
            score: p.score || 0,
            tiebreak_1: p.buchholz || 0,
            tiebreak_2: p.sonneborn_berger || 0
          }))
          : [];

        setParticipants(formattedParticipants);
      }

      // Fetch rounds
      const { data: roundsData, error: roundsError } = await supabase
        .from('rounds')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('round_number', { ascending: true });

      if (roundsError) {
        console.error('Error fetching rounds:', roundsError);
      } else {
        setRounds(roundsData || []);

        // Find current active round
        const activeRound = roundsData?.find(round => round.status === 'active');
        if (activeRound) {
          setCurrentRound(activeRound);

          // Fetch pairings for the active round
          await fetchPairingsForRound(activeRound.id);
        }
      }

      setIsLoading(false);
    };

    fetchTournamentData();
  }, [supabase, tournamentId]);

  const fetchPairingsForRound = async (roundId: string) => {
    const { data: pairingsData, error: pairingsError } = await supabase
      .from('pairings')
      .select(`
        id,
        white_id,
        black_id,
        result,
        board_number,
        white_player:tournament_participants!white_id(
          id,
          participant:participants!participant_id(
            name, 
            chesscom_username
          )
        ),
        black_player:tournament_participants!black_id(
          id,
          participant:participants!participant_id(
            name, 
            chesscom_username
          )
        )
      `)
      .eq('round_id', roundId)
      .order('board_number', { ascending: true });
  
    if (pairingsError) {
      console.error('Error fetching pairings:', pairingsError);
      return;
    }
  
    // Transform the data for easier rendering
    const formattedPairings = pairingsData?.map((pairing: PairingData) => {
      // ดึงข้อมูลผู้เล่นฝั่งขาว
      let whiteName = 'BYE';
      let whiteUsername = '-';
  
      // Helper function to safely extract player info
      const extractPlayerInfo = (playerData: any): [string, string] => {
        if (!playerData) return ['BYE', '-'];
        
        // Case 1: Array of tournament participants
        if (Array.isArray(playerData) && playerData.length > 0) {
          const participant = playerData[0].participant;
          
          // Case 1.1: Participant is an array
          if (Array.isArray(participant) && participant.length > 0) {
            return [
              participant[0].name || 'BYE',
              participant[0].chesscom_username || '-'
            ];
          } 
          // Case 1.2: Participant is an object
          else if (participant && typeof participant === 'object') {
            return [
              participant.name || 'BYE',
              participant.chesscom_username || '-'
            ];
          }
        } 
        // Case 2: Single tournament participant object
        else if (playerData && typeof playerData === 'object') {
          const participant = playerData.participant;
          
          // Case 2.1: Participant is an array
          if (Array.isArray(participant) && participant.length > 0) {
            return [
              participant[0].name || 'BYE',
              participant[0].chesscom_username || '-'
            ];
          } 
          // Case 2.2: Participant is an object
          else if (participant && typeof participant === 'object') {
            return [
              participant.name || 'BYE',
              participant.chesscom_username || '-'
            ];
          }
        }
        
        return ['BYE', '-'];
      };
  
      // Get white player info
      [whiteName, whiteUsername] = extractPlayerInfo(pairing.white_player);
      
      // Get black player info
      let [blackName, blackUsername] = extractPlayerInfo(pairing.black_player);
  
      return {
        id: pairing.id,
        white_id: pairing.white_id || '',
        white_name: whiteName,
        white_username: whiteUsername,
        black_id: pairing.black_id || '',
        black_name: blackName,
        black_username: blackUsername,
        result: pairing.result,
        board_number: pairing.board_number
      };
    }) || [];
  
    setPairings(formattedPairings);
  };

  const createNewRound = async () => {
    if (!tournament) return;

    // Determine the next round number
    const nextRoundNumber = rounds.length > 0
      ? Math.max(...rounds.map(r => r.round_number)) + 1
      : 1;

    if (nextRoundNumber > tournament.total_rounds) {
      alert('ถึงจำนวนรอบสูงสุดแล้ว');
      return;
    }

    // Check if there's an active round
    if (rounds.some(r => r.status === 'active')) {
      alert('กรุณาจบรอบปัจจุบันก่อนเริ่มรอบใหม่');
      return;
    }

    // Create new round
    const { data: newRound, error: roundError } = await supabase
      .from('rounds')
      .insert({
        tournament_id: tournamentId,
        round_number: nextRoundNumber,
        start_time: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (roundError) {
      console.error('Error creating round:', roundError);
      alert('เกิดข้อผิดพลาดในการสร้างรอบใหม่');
      return;
    }

    // Fetch all previous pairings for Swiss pairing algorithm
    const { data: previousPairingsData, error: pairingsError } = await supabase
      .from('pairings')
      .select(`
        id,
        white_id,
        black_id,
        result,
        round:round_id(round_number)
      `)
      .in('round_id', rounds.map(r => r.id));

    if (pairingsError) {
      console.error('Error fetching previous pairings:', pairingsError);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลการจับคู่ก่อนหน้า');
      return;
    }

    // Format data for the Swiss pairing algorithm
    const formattedParticipants = participants.map(p => ({
      id: p.id,
      name: p.name,
      chesscomUsername: p.chesscom_username,
      score: p.score,
      tiebreak1: p.tiebreak_1,
      tiebreak2: p.tiebreak_2
    }));

    const formattedPreviousPairings = previousPairingsData?.map(p => {
      // ดึง round_number จากโครงสร้างที่ถูกต้อง
      let roundNumber = 0;
      if (p.round && p.round.length > 0) {
        roundNumber = p.round[0].round_number || 0;
      }

      return {
        whiteId: p.white_id,
        blackId: p.black_id,
        roundNumber: roundNumber,
        result: p.result
      };
    }) || [];

    // Generate pairings using Swiss algorithm
    const generatedPairings = generateSwissPairings(
      formattedParticipants,
      formattedPreviousPairings,
      nextRoundNumber
    );

    // Insert new pairings into database
    const pairingsToInsert = generatedPairings.map((pairing, index) => ({
      round_id: newRound.id,
      white_id: pairing.whiteId,
      black_id: pairing.blackId,
      board_number: pairing.boardNumber,
      result: null
    }));

    const { error: insertError } = await supabase
      .from('pairings')
      .insert(pairingsToInsert);

    if (insertError) {
      console.error('Error inserting pairings:', insertError);
      alert('เกิดข้อผิดพลาดในการบันทึกการจับคู่');
      return;
    }

    // Refresh data
    setRounds([...rounds, newRound]);
    setCurrentRound(newRound);
    await fetchPairingsForRound(newRound.id);
  };

  const completeRound = async () => {
    if (!currentRound) return;

    // Check if all pairings have results
    const unfinishedPairings = pairings.filter(p => p.result === null);
    if (unfinishedPairings.length > 0) {
      alert(`ยังมี ${unfinishedPairings.length} การแข่งขันที่ยังไม่มีผลลัพธ์`);
      return;
    }

    // Update round status
    const { error } = await supabase
      .from('rounds')
      .update({
        status: 'completed',
        end_time: new Date().toISOString()
      })
      .eq('id', currentRound.id);

    if (error) {
      console.error('Error completing round:', error);
      alert('เกิดข้อผิดพลาดในการจบรอบ');
      return;
    }

    // Calculate tiebreaks (this would typically be done by a trigger or function in the database)
    // For simplicity, we're just updating the round status here

    // Refresh data
    window.location.reload();
  };

  const updateResult = async (pairingId: string, result: string) => {
    const { error } = await supabase
      .from('pairings')
      .update({ result })
      .eq('id', pairingId);

    if (error) {
      console.error('Error updating result:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกผลลัพธ์');
      return;
    }

    // Update local state
    setPairings(pairings.map(p =>
      p.id === pairingId ? { ...p, result } : p
    ));
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

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl text-gray-700">ไม่พบข้อมูลการแข่งขัน</p>
          <Link
            href="/admin"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            กลับหน้าแผงควบคุม
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="text-blue-600 hover:underline"
              >
                แผงควบคุม</Link>
              <span className="text-gray-500">{'>'}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{tournament.name}</h1>
            </div>
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 text-sm rounded ${tournament.status === 'active' ? 'bg-green-100 text-green-800' :
                tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                {tournament.status === 'active' ? 'กำลังแข่งขัน' :
                  tournament.status === 'upcoming' ? 'กำลังจะมาถึง' :
                    'เสร็จสิ้น'}
              </span>
              <p className="text-sm text-gray-600 mt-1">
                เวลาควบคุม: {tournament.time_control}, จำนวนรอบ: {tournament.total_rounds}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {tournament.status !== 'completed' && (
              <button
                onClick={createNewRound}
                disabled={currentRound !== null || rounds.length >= tournament.total_rounds}
                className={`px-4 py-2 rounded ${currentRound !== null || rounds.length >= tournament.total_rounds
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                เริ่มรอบใหม่
              </button>
            )}

            {currentRound && (
              <button
                onClick={completeRound}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                จบรอบปัจจุบัน
              </button>
            )}
          </div>
        </div>

        {/* Tab navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setTabView('standings')}
              className={`px-6 py-3 text-sm font-medium ${tabView === 'standings'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              อันดับคะแนน
            </button>
            <button
              onClick={() => setTabView('rounds')}
              className={`px-6 py-3 text-sm font-medium ${tabView === 'rounds'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              รอบการแข่งขัน
            </button>
            <button
              onClick={() => setTabView('participants')}
              className={`px-6 py-3 text-sm font-medium ${tabView === 'participants'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              ผู้เข้าแข่งขัน
            </button>
          </div>
        </div>

        {/* Standings Tab */}
        {tabView === 'standings' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">อันดับคะแนน</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อันดับ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chess.com</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buchholz</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S-B</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        ไม่มีผู้เข้าแข่งขัน
                      </td>
                    </tr>
                  ) : (
                    participants.map((participant, index) => (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.chesscom_username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {participant.score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.tiebreak_1?.toFixed(1) || '0.0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.tiebreak_2?.toFixed(1) || '0.0'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rounds Tab */}
        {tabView === 'rounds' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">รอบการแข่งขัน</h2>
            </div>

            {rounds.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                ยังไม่มีรอบการแข่งขัน
              </div>
            ) : (
              <div className="divide-y">
                {rounds.map((round) => (
                  <div key={round.id} className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        รอบที่ {round.round_number}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded ${round.status === 'active' ? 'bg-green-100 text-green-800' :
                        round.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {round.status === 'active' ? 'กำลังแข่งขัน' :
                          round.status === 'pending' ? 'รอการเริ่ม' :
                            'เสร็จสิ้น'}
                      </span>
                    </div>

                    {currentRound && currentRound.id === round.id ? (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">การจับคู่ปัจจุบัน</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">กระดาน</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ขาว</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ดำ</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผลลัพธ์</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {pairings.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                                    ไม่มีการจับคู่
                                  </td>
                                </tr>
                              ) : (
                                pairings.map((pairing) => (
                                  <tr key={pairing.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {pairing.board_number}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {pairing.white_name} ({pairing.white_username})
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {pairing.black_name} ({pairing.black_username})
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {pairing.result === '1-0' ? 'ขาวชนะ' :
                                        pairing.result === '0-1' ? 'ดำชนะ' :
                                          pairing.result === '1/2-1/2' ? 'เสมอ' :
                                            pairing.result === '0-0' ? 'ยกเลิก' :
                                              '-'}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                      <select
                                        value={pairing.result || ''}
                                        onChange={(e) => updateResult(pairing.id, e.target.value)}
                                        className="border rounded px-2 py-1 text-sm"
                                      >
                                        <option value="">เลือกผลลัพธ์</option>
                                        <option value="1-0">ขาวชนะ</option>
                                        <option value="0-1">ดำชนะ</option>
                                        <option value="1/2-1/2">เสมอ</option>
                                        <option value="0-0">ยกเลิก</option>
                                      </select>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setCurrentRound(round);
                          fetchPairingsForRound(round.id);
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        ดูการจับคู่
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Participants Tab */}
        {tabView === 'participants' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">ผู้เข้าแข่งขัน</h2>
              <button
                onClick={() => {
                  router.push(`/admin/tournaments/${tournamentId}/add-participants`);
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              >
                เพิ่มผู้เข้าแข่งขัน
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chess.com</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        ไม่มีผู้เข้าแข่งขัน
                      </td>
                    </tr>
                  ) : (
                    participants.map((participant) => (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {participant.chesscom_username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => {
                              // Handle withdraw/remove participant
                              if (confirm(`ต้องการลบ ${participant.name} จากการแข่งขันหรือไม่?`)) {
                                // Logic to remove participant
                              }
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            ถอนตัว
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}