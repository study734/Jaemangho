import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SquadManager } from './components/SquadManager';
import { SynergyAnalyzer } from './components/SynergyAnalyzer';
import { Settings } from './components/Settings';
import { MasteryShowcase } from './components/MasteryShowcase';
import type { Member, ChampionMastery } from './types';
import { INITIAL_MEMBERS, tickSimulation, generateActiveGame } from './mockData';
import './App.css';

const CHAMPION_ID_MAP: { [key: number]: string } = {
  1: 'Annie', 2: 'Olaf', 3: 'Galio', 4: 'TwistedFate', 5: 'XinZhao', 6: 'Urgot', 7: 'Leblanc', 8: 'Vladimir', 9: 'Fiddlesticks', 10: 'Kayle',
  11: 'MasterYi', 12: 'Alistar', 13: 'Ryze', 14: 'Sion', 15: 'Sivir', 16: 'Soraka', 17: 'Teemo', 18: 'Tristana', 19: 'Warwick', 20: 'Nunu',
  21: 'MissFortune', 22: 'Ashe', 23: 'Tryndamere', 24: 'Jax', 25: 'Morgana', 26: 'Zilean', 27: 'Singed', 28: 'Evelynn', 29: 'Twitch', 30: 'Karthus',
  31: 'ChoGath', 32: 'Amumu', 33: 'Rammus', 34: 'Anivia', 35: 'Shaco', 36: 'DrMundo', 37: 'Sona', 38: 'Kassadin', 39: 'Irelia', 40: 'Janna',
  41: 'Gangplank', 42: 'Corki', 43: 'Karma', 44: 'Taric', 45: 'Veigar', 48: 'Trundle', 50: 'Swain', 51: 'Caitlyn', 53: 'Blitzcrank', 54: 'Malphite',
  55: 'Katarina', 56: 'Nocturne', 57: 'Maokai', 58: 'Renekton', 59: 'JarvanIV', 60: 'Elise', 61: 'Orianna', 62: 'Wukong', 63: 'Brand', 64: 'LeeSin',
  67: 'Vayne', 68: 'Rumble', 69: 'Cassiopeia', 72: 'Skarner', 74: 'Heimerdinger', 75: 'Nasus', 76: 'Nidalee', 77: 'Udyr', 78: 'Poppy', 79: 'Gragas',
  80: 'Pantheon', 81: 'Ezreal', 82: 'Mordekaiser', 83: 'Yorick', 84: 'Akali', 85: 'Kennen', 86: 'Garen', 89: 'Leona', 90: 'Malzahar', 91: 'Talon',
  92: 'Riven', 96: 'KogMaw', 98: 'Shen', 99: 'Lux', 101: 'Xerath', 102: 'Shyvana', 103: 'Ahri', 104: 'Graves', 105: 'Fizz', 106: 'Volibear',
  107: 'Rengar', 110: 'Varus', 111: 'Nautilus', 112: 'Viktor', 113: 'Sejuani', 114: 'Fiora', 115: 'Ziggs', 117: 'Lulu', 119: 'Draven', 120: 'Hecarim',
  121: 'Khazix', 122: 'Darius', 126: 'Jayce', 127: 'Lissandra', 131: 'Diana', 133: 'Quinn', 134: 'Syndra', 136: 'AurelionSol', 141: 'Kayn', 142: 'Zoe',
  143: 'Zyra', 145: 'Kaisa', 147: 'Seraphine', 150: 'Gnar', 154: 'Zac', 157: 'Yasuo', 161: 'VelKoz', 163: 'Taliyah', 164: 'Camille', 166: 'Akshan',
  200: 'BelVeth', 201: 'Braum', 202: 'Jinx', 203: 'Kindred', 222: 'Jinx', 223: 'Lucian', 234: 'Viego', 235: 'Senna', 236: 'Lucian', 238: 'Zed',
  240: 'Kled', 245: 'Ekko', 246: 'Qiyana', 254: 'Vi', 266: 'Aatrox', 267: 'Nami', 268: 'Azir', 350: 'Yuumi', 360: 'Samira', 412: 'Thresh',
  420: 'Illaoi', 421: 'RekSai', 427: 'Ivern', 429: 'Kalista', 432: 'Bard', 497: 'Rakan', 498: 'Xayah', 516: 'Ornn', 517: 'Sylas', 518: 'Neeko',
  523: 'Aphelios', 526: 'Rell', 555: 'Pyke', 777: 'Yone', 875: 'Sett', 876: 'Lillia', 887: 'Gwen', 888: 'Renata', 895: 'Nilah', 897: 'KsanTe',
  902: 'Milio', 950: 'Naafiri', 910: 'Hwei', 901: 'Briar'
};

function App() {
  // Load State from LocalStorage or Fallback
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('jaemangho_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [apiMode, setApiMode] = useState<'mock' | 'real'>(() => {
    const saved = localStorage.getItem('jaemangho_api_mode');
    return (saved as 'mock' | 'real') || 'mock';
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('jaemangho_api_key') || (import.meta.env.VITE_RIOT_API_KEY as string) || '';
  });

  const [corsProxy, setCorsProxy] = useState<string>(() => {
    return localStorage.getItem('jaemangho_cors_proxy') || 'https://cors-anywhere.herokuapp.com/';
  });

  const [isLoadingRealData, setIsLoadingRealData] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('jaemangho_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('jaemangho_api_mode', apiMode);
  }, [apiMode]);

  useEffect(() => {
    localStorage.setItem('jaemangho_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('jaemangho_cors_proxy', corsProxy);
  }, [corsProxy]);

  // DYNAMIC SIMULATION LOOP (Runs every 5 seconds when in Mock Mode)
  useEffect(() => {
    if (apiMode !== 'mock') return;

    const interval = setInterval(() => {
      setMembers(prevMembers => tickSimulation(prevMembers));
    }, 5000);

    return () => clearInterval(interval);
  }, [apiMode]);

  // REAL RIOT API FETCHING ENGINE
  const fetchRealRiotData = async (targetMember?: Member) => {
    if (!apiKey) {
      alert('Riot API Key를 설정 탭에서 입력해 주세요.');
      return;
    }

    setIsLoadingRealData(true);
    setApiError(null);

    // If a specific member is passed, we fetch just them, else we fetch for ALL members
    const membersToFetch = targetMember ? [targetMember] : members;
    const fetchedStats: { [key: string]: { 
      level: number; 
      iconId: number; 
      tier: string; 
      rank: string; 
      lp: number; 
      wins: number; 
      losses: number;
      championMasteries?: ChampionMastery[];
    } } = {};

    const proxy = corsProxy.endsWith('/') ? corsProxy : `${corsProxy}/`;

    for (const member of membersToFetch) {
      try {
        // 1. Get PUUID from Riot ID (Account-V1)
        const exactName = member.gameName;
        let accountUrl = `${proxy}https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(exactName)}/${encodeURIComponent(member.tagLine)}?api_key=${apiKey}`;
        let accountRes = await fetch(accountUrl);
        
        // Fallback 1: If exact match failed and the input contains spaces, try stripping spaces ("오 채" -> "오채")
        if (!accountRes.ok && accountRes.status === 404 && exactName.includes(' ')) {
          const strippedName = exactName.replace(/\s+/g, '');
          const fallbackUrl = `${proxy}https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(strippedName)}/${encodeURIComponent(member.tagLine)}?api_key=${apiKey}`;
          console.log(`[Riot API] Exact match failed. Trying stripped spaces fallback: ${strippedName}`);
          const fallbackRes = await fetch(fallbackUrl);
          if (fallbackRes.ok) {
            accountRes = fallbackRes;
          }
        }
        
        // Fallback 2: If exact match failed and has no spaces, try inserting a space after the first character ("오채" -> "오 채")
        if (!accountRes.ok && accountRes.status === 404 && !exactName.includes(' ') && exactName.length > 1) {
          const spacedName = exactName.charAt(0) + ' ' + exactName.slice(1);
          const fallbackUrl2 = `${proxy}https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(spacedName)}/${encodeURIComponent(member.tagLine)}?api_key=${apiKey}`;
          console.log(`[Riot API] Exact match failed. Trying Korean spaced fallback: ${spacedName}`);
          const fallbackRes2 = await fetch(fallbackUrl2);
          if (fallbackRes2.ok) {
            accountRes = fallbackRes2;
          }
        }

        if (!accountRes.ok) {
          if (accountRes.status === 401) {
            throw new Error('라이엇 API 키가 올바르지 않습니다 (HTTP 401). 설정에서 키 형식을 확인해 주세요.');
          } else if (accountRes.status === 403) {
            throw new Error('라이엇 API 키가 만료되었습니다 (HTTP 403). 라이엇 개발자 사이트(https://developer.riotgames.com/)에서 새 키를 갱신해 주세요.');
          } else if (accountRes.status === 404) {
            throw new Error(`존재하지 않는 Riot ID입니다 (HTTP 404). 대원명(${member.gameName})과 태그(#${member.tagLine})에 오타가 없는지 확인해 주세요.`);
          } else if (accountRes.status === 429) {
            throw new Error('API 요청 제한을 초과했습니다 (HTTP 429). 잠시 후 다시 시도해 주세요.');
          }
          throw new Error(`Riot ID 조회 실패 (HTTP ${accountRes.status})`);
        }
        const accountData = await accountRes.json();
        const puuid = accountData.puuid;

        // 2. Get Summoner Details (Summoner-V4)
        const summonerUrl = `${proxy}https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`;
        const summonerRes = await fetch(summonerUrl);
        if (!summonerRes.ok) {
          if (summonerRes.status === 401 || summonerRes.status === 403) {
            throw new Error(`인증 에러 (HTTP ${summonerRes.status}): API 키가 만료되었습니다.`);
          }
          throw new Error(`소환사 상세조회 실패 (HTTP ${summonerRes.status})`);
        }
        const summonerData = await summonerRes.json();
        const encryptedId = summonerData.id;
        const level = summonerData.summonerLevel;
        const iconId = summonerData.profileIconId;

        // 3. Get Ranked Entries (League-V4)
        const leagueUrl = `${proxy}https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedId}?api_key=${apiKey}`;
        const leagueRes = await fetch(leagueUrl);
        if (!leagueRes.ok) {
          throw new Error(`랭크 정보 조회 실패 (HTTP ${leagueRes.status})`);
        }
        const leagueData = await leagueRes.json();

        interface RiotLeagueEntry {
          queueType: string;
          tier: string;
          rank: string;
          leaguePoints: number;
          wins: number;
          losses: number;
        }
        const leagueDataTyped = leagueData as RiotLeagueEntry[];
        const soloEntry = leagueDataTyped.find((entry) => entry.queueType === 'RANKED_SOLO_5x5') || leagueDataTyped[0];

        // 4. Get Top 3 Champion Masteries (Champion-Mastery-V4)
        let topMasteries: ChampionMastery[] = [];
        try {
          const masteryUrl = `${proxy}https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=3&api_key=${apiKey}`;
          const masteryRes = await fetch(masteryUrl);
          if (masteryRes.ok) {
            const masteryData = await masteryRes.json();
            interface RiotMastery {
              championId: number;
              championLevel: number;
              championPoints: number;
              lastPlayTime: number;
            }
            const typedMastery = masteryData as RiotMastery[];
            topMasteries = typedMastery.map(m => ({
              championId: m.championId,
              championName: CHAMPION_ID_MAP[m.championId] || 'Ezreal',
              championLevel: m.championLevel,
              championPoints: m.championPoints,
              lastPlayTime: m.lastPlayTime
            }));
          }
        } catch (masteryErr) {
          console.warn(`Failed to fetch masteries for ${member.gameName}, skipping`, masteryErr);
        }

        fetchedStats[member.id] = {
          level,
          iconId,
          tier: soloEntry ? soloEntry.tier : 'UNRANKED',
          rank: soloEntry ? soloEntry.rank : '',
          lp: soloEntry ? soloEntry.leaguePoints : 0,
          wins: soloEntry ? soloEntry.wins : 0,
          losses: soloEntry ? soloEntry.losses : 0,
          championMasteries: topMasteries.length > 0 ? topMasteries : undefined
        };
      } catch (err) {
        console.error(`Failed to fetch real data for ${member.gameName}:`, err);
        const errorMessage = err instanceof Error ? err.message : '네트워크 오류';
        setApiError(`[${member.gameName}] API 연동 실패: ${errorMessage}. 라이엇 API 키 유효성(RGAPI)을 검사하거나, CORS 프록시 승인이 필요할 수 있습니다.`);
      }
    }

    // Update using functional state to prevent race conditions!
    setMembers(prev => prev.map(m => {
      const stats = fetchedStats[m.id];
      if (stats) {
        return {
          ...m,
          summonerLevel: stats.level,
          profileIconId: stats.iconId,
          tier: stats.tier,
          rank: stats.rank,
          leaguePoints: stats.lp,
          wins: stats.wins,
          losses: stats.losses,
          championMasteries: stats.championMasteries || m.championMasteries
        };
      }
      return m;
    }));

    setIsLoadingRealData(false);
  };

  // Add Member Handler
  const handleAddMember = (newMemberData: Omit<Member, 'id' | 'matches' | 'activeGame'>) => {
    // Check for duplicate Riot ID
    const duplicate = members.some(
      m => m.gameName.toLowerCase() === newMemberData.gameName.toLowerCase() && 
           m.tagLine.toLowerCase() === newMemberData.tagLine.toLowerCase()
    );

    if (duplicate) {
      alert('이미 동일한 Riot ID를 가진 대원이 존재합니다.');
      return;
    }

    const newId = Math.random().toString(36).substring(2, 9);
    
    // Create base member
    const newMember: Member = {
      ...newMemberData,
      id: newId,
      activeGame: Math.random() < 0.2 ? generateActiveGame(newMemberData.gameName, newMemberData.tagLine) : null,
      matches: []
    };

    // Prepopulate some realistic matches for this new member so the dashboard doesn't look empty
    const mockChamps = ['Ezreal', 'Aatrox', 'LeeSin', 'Lulu', 'Yasuo', 'Lux'];
    const chosenChamp = mockChamps[Math.floor(Math.random() * mockChamps.length)];
    
    newMember.matches = Array.from({ length: 4 }, (_, idx) => {
      const isWin = Math.random() > 0.45;
      const duration = Math.floor(Math.random() * 600) + 1200;
      return {
        matchId: Math.random().toString(36).substring(2, 9),
        gameMode: 'CLASSIC',
        gameDuration: duration,
        gameCreation: Date.now() - (idx + 1) * 3 * 60 * 60 * 1000,
        championName: chosenChamp,
        kills: isWin ? Math.floor(Math.random() * 8) + 4 : Math.floor(Math.random() * 4) + 1,
        deaths: isWin ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 6) + 4,
        assists: Math.floor(Math.random() * 10) + 2,
        win: isWin,
        cs: Math.floor(Math.random() * 120) + 60,
        gold: Math.floor(Math.random() * 6000) + 6000,
        items: Array.from({ length: 6 }, () => Math.floor(Math.random() * 1000) + 3000),
        allPlayers: []
      };
    });

    setMembers(prev => [newMember, ...prev]);

    // If real API mode is active, trigger an background fetch to get their actual level/tier
    if (apiMode === 'real' && apiKey) {
      fetchRealRiotData(newMember);
    }
  };

  // Remove Member Handler
  const handleRemoveMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Update Member Handler (used for edits)
  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  // Reset to default crew
  const handleResetMembers = () => {
    localStorage.removeItem('jaemangho_members');
    setMembers(INITIAL_MEMBERS);
  };

  return (
    <div style={styles.appContainer}>
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        members={members} 
      />

      {/* Main Content Pane */}
      <main style={styles.mainPane}>
        {/* Dynamic Loading Overlay for Real API */}
        {isLoadingRealData && (
          <div style={styles.loadingBanner}>
            <span className="pulse-indicator" style={{ marginRight: '8px' }} />
            라이엇 서버로부터 대원들의 최신 전적을 받아오고 있습니다...
          </div>
        )}

        {/* Dynamic API Error Banner */}
        {apiError && (
          <div style={styles.errorBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
              <span>⚠️</span>
              <span>
                {apiError}{' '}
                <a 
                  href="https://cors-anywhere.herokuapp.com/corsdemo" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#fa6e39', textDecoration: 'underline', fontWeight: 600 }}
                >
                  CORS Anywhere 프록시 활성화 데모 페이지 바로가기 (Click)
                </a>
              </span>
            </div>
            <button 
              className="btn" 
              style={styles.errorCloseBtn} 
              onClick={() => setApiError(null)}
            >
              닫기
            </button>
          </div>
        )}

        {/* Sync Button for Real API Mode */}
        {apiMode === 'real' && apiKey && !isLoadingRealData && (
          <div style={styles.syncRow}>
            <button 
              className="btn btn-secondary" 
              style={styles.syncBtn} 
              onClick={() => fetchRealRiotData()}
            >
              🔄 실시간 데이터 강제 동기화
            </button>
          </div>
        )}

        {/* Render Selected Tab */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            members={members} 
            onSelectMember={() => {
              setActiveTab('squad');
            }}
          />
        )}

        {activeTab === 'squad' && (
          <SquadManager 
            members={members}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onUpdateMember={handleUpdateMember}
          />
        )}

        {activeTab === 'synergy' && (
          <SynergyAnalyzer 
            members={members} 
          />
        )}

        {activeTab === 'mastery' && (
          <MasteryShowcase 
            members={members} 
          />
        )}

        {activeTab === 'settings' && (
          <Settings 
            apiMode={apiMode}
            setApiMode={setApiMode}
            apiKey={apiKey}
            setApiKey={setApiKey}
            corsProxy={corsProxy}
            setCorsProxy={setCorsProxy}
            onResetMembers={handleResetMembers}
          />
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
  mainPane: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#0b2a38',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  loadingBanner: {
    backgroundColor: '#ffb703',
    color: '#001e2b',
    padding: '8px 24px',
    textAlign: 'center' as const,
    fontSize: '13px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  syncRow: {
    padding: '16px 32px 0 32px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  syncBtn: {
    fontSize: '12.5px',
    padding: '6px 14px',
  },
  errorBanner: {
    backgroundColor: '#fff8e0', // MongoDB warning bg
    color: '#946f3f', // MongoDB warning text
    padding: '12px 24px',
    fontSize: '13px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1.5px solid #fa6e39', // warning accent border
    zIndex: 5,
  },
  errorCloseBtn: {
    fontSize: '11px',
    padding: '4px 10px',
    color: '#946f3f',
    borderColor: '#946f3f',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: '1px solid #946f3f',
    borderRadius: '4px',
    marginLeft: '16px',
    fontWeight: 600,
  }
};

export default App;
