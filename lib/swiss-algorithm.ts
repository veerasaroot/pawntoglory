export type Participant = {
    id: string;
    name: string;
    chesscomUsername: string;
    seed?: number;
    score: number;
    tiebreak1?: number; // Buchholz
    tiebreak2?: number; // Sonneborn-Berger
  };
  
  export type Pairing = {
    whiteId: string;
    blackId: string;
    boardNumber: number;
  };
  
  export type PreviousPairing = {
    whiteId: string;
    blackId: string;
    roundNumber: number;
    result?: string;
  };
  
  /**
   * Generate Swiss pairings for a chess tournament round
   * 
   * @param participants - List of tournament participants
   * @param previousPairings - List of pairings from previous rounds
   * @param roundNumber - Current round number
   * @param allowRematches - Whether to allow rematches if no perfect pairing is possible
   * @returns List of pairings for the current round
   */
  export function generateSwissPairings(
    participants: Participant[],
    previousPairings: PreviousPairing[],
    roundNumber: number,
    allowRematches: boolean = false
  ): Pairing[] {
    // Sort participants by score (descending) and then by seed/rating if available
    const sortedParticipants = [...participants].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      
      // If scores are equal, use tiebreaks
      if (a.tiebreak1 !== undefined && b.tiebreak1 !== undefined && a.tiebreak1 !== b.tiebreak1) {
        return b.tiebreak1 - a.tiebreak1;
      }
      
      // Finally, use seed if available
      if (a.seed !== undefined && b.seed !== undefined) {
        return a.seed - b.seed;
      }
      
      return 0;
    });
  
    // Prepare result
    const pairings: Pairing[] = [];
    
    // Handle odd number of players - add a bye
    let participantsToMatch = [...sortedParticipants];
    if (participantsToMatch.length % 2 !== 0) {
      // Find the lowest-scoring player who hasn't had a bye yet
      const byeCandidates = participantsToMatch
        .filter(p => !previousPairings.some(
          pair => (pair.whiteId === 'BYE' && pair.blackId === p.id) || 
                 (pair.blackId === 'BYE' && pair.whiteId === p.id)
        ))
        .sort((a, b) => a.score - b.score);
      
      if (byeCandidates.length > 0) {
        // Remove the bye player from participants to match
        const byePlayer = byeCandidates[0];
        participantsToMatch = participantsToMatch.filter(p => p.id !== byePlayer.id);
        
        // Add a "virtual pairing" to previous pairings to record the bye
        previousPairings.push({
          whiteId: byePlayer.id,
          blackId: 'BYE',
          roundNumber,
          result: '1-0', // Player with bye gets a win
        });
      } else {
        // If everyone has had a bye, give it to the lowest scoring player
        const byePlayer = participantsToMatch.sort((a, b) => a.score - b.score)[0];
        participantsToMatch = participantsToMatch.filter(p => p.id !== byePlayer.id);
        
        previousPairings.push({
          whiteId: byePlayer.id,
          blackId: 'BYE',
          roundNumber,
          result: '1-0',
        });
      }
    }
  
    // Group participants by score
    const scoreGroups: { [score: number]: Participant[] } = {};
    participantsToMatch.forEach(p => {
      if (!scoreGroups[p.score]) {
        scoreGroups[p.score] = [];
      }
      scoreGroups[p.score].push(p);
    });
  
    // Get all unique scores in descending order
    const scores = Object.keys(scoreGroups)
      .map(Number)
      .sort((a, b) => b - a);
  
    // For first round, pair by seed/rating
    if (roundNumber === 1) {
      const halfLength = participantsToMatch.length / 2;
      for (let i = 0; i < halfLength; i++) {
        pairings.push({
          whiteId: participantsToMatch[i].id,
          blackId: participantsToMatch[i + halfLength].id,
          boardNumber: i + 1
        });
      }
      return pairings;
    }
  
    // Helper function to check if two players have played before
    const havePlayed = (player1: string, player2: string): boolean => {
      return previousPairings.some(
        pair => 
          (pair.whiteId === player1 && pair.blackId === player2) || 
          (pair.whiteId === player2 && pair.blackId === player1)
      );
    };
  
    // For subsequent rounds, pair within score groups where possible
    const unpaired: Participant[] = [];
    let boardNumber = 1;
  
    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];
      let playersInGroup = [...scoreGroups[score], ...unpaired];
      unpaired.length = 0;  // Clear the unpaired array
  
      // Sort again to ensure highest scoring unpaired players are preferred
      playersInGroup.sort((a, b) => b.score - a.score);
  
      // If odd number in this group, move the lowest down to next group
      if (playersInGroup.length % 2 !== 0 && i < scores.length - 1) {
        // Find player with lowest score and tiebreaks
        const lowestPlayer = playersInGroup.sort((a, b) => {
          if (a.score !== b.score) return a.score - b.score;
          if (a.tiebreak1 !== undefined && b.tiebreak1 !== undefined) {
            return a.tiebreak1 - b.tiebreak1;
          }
          return 0;
        })[0];
        
        // Remove from current group and add to unpaired for next group
        playersInGroup = playersInGroup.filter(p => p.id !== lowestPlayer.id);
        unpaired.push(lowestPlayer);
      }
  
      // Try to pair players in current group
      while (playersInGroup.length >= 2) {
        const player1 = playersInGroup[0];
        playersInGroup.splice(0, 1);
  
        // Try to find a player who hasn't played player1 yet
        let foundPairing = false;
        for (let j = 0; j < playersInGroup.length; j++) {
          const player2 = playersInGroup[j];
          
          if (!havePlayed(player1.id, player2.id) || allowRematches) {
            // Create pairing, alternating colors if possible
            // Count how many times each player has played white
            const player1WhiteCount = previousPairings.filter(p => p.whiteId === player1.id).length;
            const player2WhiteCount = previousPairings.filter(p => p.whiteId === player2.id).length;
            
            // Try to balance colors
            if (player1WhiteCount <= player2WhiteCount) {
              pairings.push({
                whiteId: player1.id,
                blackId: player2.id,
                boardNumber: boardNumber++
              });
            } else {
              pairings.push({
                whiteId: player2.id,
                blackId: player1.id,
                boardNumber: boardNumber++
              });
            }
            
            // Remove the paired player
            playersInGroup.splice(j, 1);
            foundPairing = true;
            break;
          }
        }
        
        // If no compatible pairing found and we're in the last score group
        if (!foundPairing) {
          if (i === scores.length - 1 || allowRematches) {
            // Force a pairing with the next player
            if (playersInGroup.length > 0) {
              const player2 = playersInGroup[0];
              playersInGroup.splice(0, 1);
              
              // Balance colors
              const player1WhiteCount = previousPairings.filter(p => p.whiteId === player1.id).length;
              const player2WhiteCount = previousPairings.filter(p => p.whiteId === player2.id).length;
              
              if (player1WhiteCount <= player2WhiteCount) {
                pairings.push({
                  whiteId: player1.id,
                  blackId: player2.id,
                  boardNumber: boardNumber++
                });
              } else {
                pairings.push({
                  whiteId: player2.id,
                  blackId: player1.id,
                  boardNumber: boardNumber++
                });
              }
            } else {
              // No players left in this group, add to unpaired for next group
              unpaired.push(player1);
            }
          } else {
            // Move to next score group
            unpaired.push(player1);
          }
        }
      }
      
      // If any player left in this group, add to unpaired
      if (playersInGroup.length > 0) {
        unpaired.push(...playersInGroup);
      }
    }
    
    // Handle any remaining unpaired players (should only happen in the last group)
    while (unpaired.length >= 2) {
      const player1 = unpaired[0];
      unpaired.splice(0, 1);
      
      const player2 = unpaired[0];
      unpaired.splice(0, 1);
      
      // Balance colors
      const player1WhiteCount = previousPairings.filter(p => p.whiteId === player1.id).length;
      const player2WhiteCount = previousPairings.filter(p => p.whiteId === player2.id).length;
      
      if (player1WhiteCount <= player2WhiteCount) {
        pairings.push({
          whiteId: player1.id,
          blackId: player2.id,
          boardNumber: boardNumber++
        });
      } else {
        pairings.push({
          whiteId: player2.id,
          blackId: player1.id,
          boardNumber: boardNumber++
        });
      }
    }
    
    // If there's still an unpaired player, this shouldn't normally happen
    // but we can assign a bye or handle as needed
    if (unpaired.length > 0) {
      console.warn("Unpaired player after algorithm completion:", unpaired[0]);
    }
    
    return pairings;
  }