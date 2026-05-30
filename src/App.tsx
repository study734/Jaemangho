/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios, { type AxiosError } from 'axios';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SquadManager } from './components/SquadManager';
import { SynergyAnalyzer } from './components/SynergyAnalyzer';
import { Settings } from './components/Settings';
import { MasteryShowcase } from './components/MasteryShowcase';
import type { Member, ChampionMastery, MatchHistory, MatchPlayer, ActiveGame } from './types';
import { INITIAL_MEMBERS, tickSimulation, generateActiveGame, generateMockMatch } from './mockData';
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
    const saved = localStorage.getItem('jaemangho_cors_proxy');
    if (!saved || saved.includes('cors-anywhere.herokuapp.com')) {
      return 'https://corsproxy.io/?';
    }
    return saved;
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
      matches?: MatchHistory[];
      activeGame?: ActiveGame | null;
    } } = {};

    const proxy = corsProxy.includes('?')
      ? corsProxy
      : (corsProxy.endsWith('/') ? corsProxy : `${corsProxy}/`);

    // Sleep helper to avoid burst rate limit issues (HTTP 429)
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const member of membersToFetch) {
      try {
        // Sequential delay between members (if multiple) to respect rate limits
        if (membersToFetch.length > 1 && membersToFetch.indexOf(member) > 0) {
          await sleep(150);
        }

        // 1. Get PUUID from Riot ID (Account-V1)
        const exactName = member.gameName;

        // Helper: axios GET that returns null on 404, throws on other errors
        const riotGet = async <T,>(url: string): Promise<T | null> => {
          try {
            const res = await axios.get<T>(url);
            return res.data;
          } catch (e) {
            const err = e as AxiosError;
            if (err.response?.status === 404) return null;
            const status = err.response?.status;
            if (status === 401) throw new Error('라이엇 API 키가 올바르지 않습니다 (HTTP 401). 설정에서 키 형식을 확인해 주세요.', { cause: e });
            if (status === 403) throw new Error('라이엇 API 키가 만료되었습니다 (HTTP 403). 라이엇 개발자 사이트에서 새 키를 갱신해 주세요.', { cause: e });
            if (status === 429) throw new Error('API 요청 제한을 초과했습니다 (HTTP 429). 잠시 후 다시 시도해 주세요.', { cause: e });
            throw new Error(`Riot API 요청 실패 (HTTP ${status ?? 'network'})`, { cause: e });
          }
        };

        const buildAccountUrl = (name: string) =>
          `${proxy}https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(member.tagLine)}?api_key=${apiKey}`;

        // Try exact name, then fallbacks for Korean name spacing
        let accountData = await riotGet<{ puuid: string }>(buildAccountUrl(exactName));

        if (!accountData && exactName.includes(' ')) {
          const stripped = exactName.replace(/\s+/g, '');
          console.log(`[Riot API] Trying stripped spaces fallback: ${stripped}`);
          accountData = await riotGet<{ puuid: string }>(buildAccountUrl(stripped));
        }

        if (!accountData && !exactName.includes(' ') && exactName.length > 1) {
          const spaced = exactName.charAt(0) + ' ' + exactName.slice(1);
          console.log(`[Riot API] Trying Korean spaced fallback: ${spaced}`);
          accountData = await riotGet<{ puuid: string }>(buildAccountUrl(spaced));
        }

        if (!accountData) {
          throw new Error(`존재하지 않는 Riot ID입니다 (HTTP 404). 대원명(${member.gameName})과 태그(#${member.tagLine})에 오타가 없는지 확인해 주세요.`);
        }

        const puuid = accountData.puuid;

        // 2. Get Summoner Details (Summoner-V4)
        const summonerUrl = `${proxy}https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`;
        const summonerData = await (async () => {
          try {
            const res = await axios.get<{ id: string; summonerLevel: number; profileIconId: number }>(summonerUrl);
            return res.data;
          } catch (e) {
            const err = e as AxiosError;
            throw new Error(`소환사 상세조회 실패 (HTTP ${err.response?.status ?? 'network'})`, { cause: e });
          }
        })();
        const encryptedId = summonerData.id;
        const level = summonerData.summonerLevel;
        const iconId = summonerData.profileIconId;

        // 3. Get Ranked Entries (League-V4)
        const leagueUrl = `${proxy}https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedId}?api_key=${apiKey}`;
        const leagueData = await (async () => {
          try {
            const res = await axios.get(leagueUrl);
            return res.data;
          } catch (e) {
            const err = e as AxiosError;
            throw new Error(`랭크 정보 조회 실패 (HTTP ${err.response?.status ?? 'network'})`, { cause: e });
          }
        })();

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
        interface RiotMastery { championId: number; championLevel: number; championPoints: number; lastPlayTime: number; }
        let topMasteries: ChampionMastery[] = [];
        try {
          const masteryUrl = `${proxy}https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=3&api_key=${apiKey}`;
          const { data: masteryData } = await axios.get<RiotMastery[]>(masteryUrl);
          topMasteries = masteryData.map(m => ({
            championId: m.championId,
            championName: CHAMPION_ID_MAP[m.championId] || 'Ezreal',
            championLevel: m.championLevel,
            championPoints: m.championPoints,
            lastPlayTime: m.lastPlayTime
          }));
        } catch (masteryErr) {
          console.warn(`Failed to fetch masteries for ${member.gameName}, skipping`, masteryErr);
        }

        // 5. Get Real Recent 3 Matches (Match-V5)
        const realMatches: MatchHistory[] = [];
        try {
          const matchIdsUrl = `${proxy}https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=3&api_key=${apiKey}`;
          const { data: matchIds } = await axios.get<string[]>(matchIdsUrl);
          for (const matchId of matchIds) {
            await sleep(80);
            try {
              const matchDetailUrl = `${proxy}https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`;
              const { data: matchData } = await axios.get<any>(matchDetailUrl);
              const info = matchData.info;
              if (info && info.participants) {
                const playerPart = info.participants.find((p: any) => p.puuid === puuid) || info.participants[0];

                const allPlayersMapped: MatchPlayer[] = info.participants.map((p: any) => {
                  let pName = p.riotIdGameName || p.summonerName || '소환사';
                  let pTag = p.riotIdTagline || '';
                  if (!pTag && p.summonerName && p.summonerName.includes('#')) {
                    const parts = p.summonerName.split('#');
                    pName = parts[0];
                    pTag = parts[1] || '';
                  }
                  return {
                    gameName: pName,
                    tagLine: pTag,
                    championName: p.championName || 'Unknown',
                    championId: p.championId || 0,
                    kills: p.kills || 0,
                    deaths: p.deaths || 0,
                    assists: p.assists || 0,
                    win: !!p.win,
                    totalMinionsKilled: (p.totalMinionsKilled || 0) + (p.neutralMinionsKilled || 0),
                    goldEarned: p.goldEarned || 0,
                    itemIds: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].filter((id: any) => id !== undefined && id !== null)
                  };
                });

                realMatches.push({
                  matchId,
                  gameMode: info.gameMode || 'CLASSIC',
                  gameDuration: info.gameDuration || 0,
                  gameCreation: info.gameCreation || Date.now(),
                  championName: playerPart.championName || 'Unknown',
                  kills: playerPart.kills || 0,
                  deaths: playerPart.deaths || 0,
                  assists: playerPart.assists || 0,
                  win: !!playerPart.win,
                  cs: (playerPart.totalMinionsKilled || 0) + (playerPart.neutralMinionsKilled || 0),
                  gold: playerPart.goldEarned || 0,
                  items: [playerPart.item0, playerPart.item1, playerPart.item2, playerPart.item3, playerPart.item4, playerPart.item5, playerPart.item6].filter((id: any) => id !== undefined && id !== null),
                  allPlayers: allPlayersMapped
                });
              }
            } catch (matchDetailErr) {
              console.warn(`Failed to fetch match detail ${matchId}`, matchDetailErr);
            }
          }
        } catch (matchErr) {
          console.warn(`Failed to fetch match history for ${member.gameName}`, matchErr);
        }

        // 6. Get Real Active Game (Spectator-V5)
        let realActiveGame: ActiveGame | null = null;
        try {
          const spectatorUrl = `${proxy}https://kr.api.riotgames.com/lol/spectator/v5/active-games/by-puuid/${puuid}?api_key=${apiKey}`;
          const { data: spectatorData } = await axios.get<any>(spectatorUrl);
          const playerPart = spectatorData.participants.find((p: any) => p.puuid === puuid);
          const playerTeamId = playerPart ? playerPart.teamId : 100;

          const teamPlayers = spectatorData.participants.map((p: any) => {
            let name = p.summonerName || 'Unknown';
            let tag = '';
            if (p.riotId) {
              const parts = p.riotId.split('#');
              name = parts[0];
              tag = parts[1] || '';
            } else if (p.summonerName && p.summonerName.includes('#')) {
              const parts = p.summonerName.split('#');
              name = parts[0];
              tag = parts[1] || '';
            }
            return {
              gameName: name,
              tagLine: tag,
              championName: CHAMPION_ID_MAP[p.championId] || 'Unknown',
              isAlly: p.teamId === playerTeamId
            };
          });

          const playerChampId = playerPart ? playerPart.championId : 0;
          realActiveGame = {
            gameId: spectatorData.gameId,
            gameLength: spectatorData.gameLength,
            gameStartTime: spectatorData.gameStartTime,
            championName: CHAMPION_ID_MAP[playerChampId] || 'Unknown',
            mapId: spectatorData.mapId,
            gameMode: spectatorData.gameMode,
            teamPlayers
          };
        } catch (specErr) {
          const specAxiosErr = specErr as AxiosError;
          // 404 = not in game, suppress it silently
          if (specAxiosErr.response?.status !== 404) {
            console.warn(`Failed to fetch active game for ${member.gameName}`, specErr);
          }
        }

        fetchedStats[member.id] = {
          level,
          iconId,
          tier: soloEntry ? soloEntry.tier : 'UNRANKED',
          rank: soloEntry ? soloEntry.rank : '',
          lp: soloEntry ? soloEntry.leaguePoints : 0,
          wins: soloEntry ? soloEntry.wins : 0,
          losses: soloEntry ? soloEntry.losses : 0,
          championMasteries: topMasteries.length > 0 ? topMasteries : undefined,
          matches: realMatches.length > 0 ? realMatches : undefined,
          activeGame: realActiveGame
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
          championMasteries: stats.championMasteries || m.championMasteries,
          matches: stats.matches || m.matches,
          activeGame: stats.activeGame !== undefined ? stats.activeGame : m.activeGame
        };
      }
      return m;
    }));

    setIsLoadingRealData(false);
  };

  // REAL OR MOCK SUMMONER SEARCH & PREVIEW UTILITY
  const handleSearchMember = async (gameName: string, tagLine: string): Promise<Omit<Member, 'id' | 'matches' | 'activeGame'>> => {
    const trimmedName = gameName.trim();
    const trimmedTag = tagLine.trim().toUpperCase();

    if (!trimmedName || !trimmedTag) {
      throw new Error('소환사명과 태그라인을 둘 다 입력해 주세요.');
    }

    if (apiMode === 'mock') {
      const normalizedName = trimmedName.toLowerCase().replace(/\s+/g, '');
      
      // Presets for famous names
      if (normalizedName.includes('faker')) {
        return {
          gameName: 'Faker',
          tagLine: trimmedTag,
          summonerLevel: 780,
          profileIconId: 6,
          tier: 'CHALLENGER',
          rank: 'I',
          leaguePoints: 1653,
          wins: 588,
          losses: 412,
          championMasteries: [
            { championId: 103, championName: 'Ahri', championLevel: 7, championPoints: 1420500, lastPlayTime: Date.now() - 3600000 },
            { championId: 13, championName: 'Ryze', championLevel: 7, championPoints: 980400, lastPlayTime: Date.now() - 7200000 },
            { championId: 238, championName: 'Zed', championLevel: 7, championPoints: 850200, lastPlayTime: Date.now() - 14400000 }
          ]
        };
      }
      
      if (normalizedName.includes('showmaker')) {
        return {
          gameName: 'ShowMaker',
          tagLine: trimmedTag,
          summonerLevel: 620,
          profileIconId: 12,
          tier: 'CHALLENGER',
          rank: 'I',
          leaguePoints: 1342,
          wins: 489,
          losses: 391,
          championMasteries: [
            { championId: 134, championName: 'Syndra', championLevel: 7, championPoints: 840300, lastPlayTime: Date.now() - 3600000 },
            { championId: 7, championName: 'Leblanc', championLevel: 7, championPoints: 720100, lastPlayTime: Date.now() - 10800000 },
            { championId: 38, championName: 'Kassadin', championLevel: 6, championPoints: 410500, lastPlayTime: Date.now() - 86400000 }
          ]
        };
      }
      
      // Dynamic random based on string hashing
      let hash = 0;
      for (let i = 0; i < trimmedName.length; i++) {
        hash = trimmedName.charCodeAt(i) + ((hash << 5) - hash);
      }
      const absHash = Math.abs(hash);
      
      const tiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'];
      const tierWeights = [0.03, 0.05, 0.12, 0.22, 0.22, 0.18, 0.12, 0.04, 0.01, 0.01]; 
      let cumulative = 0;
      const randValue = (absHash % 100) / 100;
      let chosenTier = 'GOLD';
      for (let i = 0; i < tiers.length; i++) {
        cumulative += tierWeights[i];
        if (randValue <= cumulative) {
          chosenTier = tiers[i];
          break;
        }
      }

      const ranks = ['IV', 'III', 'II', 'I'];
      const chosenRank = ranks[absHash % 4];
      const level = (absHash % 450) + 30;
      const iconId = absHash % 1000;
      const lp = chosenTier === 'MASTER' || chosenTier === 'GRANDMASTER' || chosenTier === 'CHALLENGER' ? (absHash % 1200) : (absHash % 100);
      const wins = (absHash % 200) + 20;
      const losses = (absHash % 190) + 20;
      
      const mockChamps = ['Ezreal', 'Aatrox', 'LeeSin', 'Lulu', 'Yasuo', 'Lux'];
      const shuffledChamps = [...mockChamps].sort((a, b) => {
        const hashA = (a.charCodeAt(0) + absHash) % 10;
        const hashB = (b.charCodeAt(0) + absHash) % 10;
        return hashA - hashB;
      });

      return {
        gameName: trimmedName,
        tagLine: trimmedTag,
        summonerLevel: level,
        profileIconId: iconId,
        tier: chosenTier,
        rank: chosenRank,
        leaguePoints: lp,
        wins,
        losses,
        championMasteries: [
          { championId: 81, championName: shuffledChamps[0], championLevel: 7, championPoints: 120000 + (absHash % 500000), lastPlayTime: Date.now() - 3600000 * (absHash % 48) },
          { championId: 266, championName: shuffledChamps[1], championLevel: 6, championPoints: 45000 + (absHash % 200000), lastPlayTime: Date.now() - 3600000 * (absHash % 120) },
          { championId: 64, championName: shuffledChamps[2], championLevel: 5, championPoints: 15000 + (absHash % 80000), lastPlayTime: Date.now() - 3600000 * (absHash % 300) }
        ]
      };
    }

    // REAL RIOT API SEARCH ENGINE
    if (!apiKey) {
      throw new Error('Riot API Key를 설정 탭에서 입력해 주세요.');
    }

    const proxy = corsProxy.includes('?')
      ? corsProxy
      : (corsProxy.endsWith('/') ? corsProxy : `${corsProxy}/`);

    // Helper: axios GET with 404->null, other errors throw with Korean message
    const searchGet = async <T,>(url: string): Promise<T | null> => {
      try {
        const res = await axios.get<T>(url);
        return res.data;
      } catch (e) {
        const err = e as AxiosError;
        const status = err.response?.status;
        if (status === 404) return null;
        if (status === 401) throw new Error('라이엇 API 키가 올바르지 않습니다. (HTTP 401)', { cause: e });
        if (status === 403) throw new Error('라이엇 API 키가 만료되었습니다. (HTTP 403)', { cause: e });
        if (status === 429) throw new Error('요청 제한을 초과했습니다. 잠시 후 다시 시도해 주세요. (HTTP 429)', { cause: e });
        throw new Error(`Riot API 요청 실패 (HTTP ${status ?? 'network'})`, { cause: e });
      }
    };

    // 1. Resolve PUUID (Account-V1) with fallbacks
    const buildSearchUrl = (name: string) =>
      `${proxy}https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(trimmedTag)}?api_key=${apiKey}`;

    let accountData = await searchGet<{ puuid: string; gameName: string; tagLine: string }>(buildSearchUrl(trimmedName));

    if (!accountData && trimmedName.includes(' ')) {
      const stripped = trimmedName.replace(/\s+/g, '');
      console.log(`[Search API] Trying stripped spaces fallback: ${stripped}`);
      accountData = await searchGet(buildSearchUrl(stripped));
    }

    if (!accountData && !trimmedName.includes(' ') && trimmedName.length > 1) {
      const spaced = trimmedName.charAt(0) + ' ' + trimmedName.slice(1);
      console.log(`[Search API] Trying Korean spaced fallback: ${spaced}`);
      accountData = await searchGet(buildSearchUrl(spaced));
    }

    if (!accountData) {
      throw new Error(`존재하지 않는 Riot ID입니다. (${trimmedName}#${trimmedTag})`);
    }

    const puuid = accountData.puuid;
    const finalGameName = accountData.gameName || trimmedName;
    const finalTagLine = accountData.tagLine || trimmedTag;

    // 2. Summoner details (Summoner-V4)
    const summonerData = await searchGet<{ id: string; summonerLevel: number; profileIconId: number }>(
      `${proxy}https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`
    );
    if (!summonerData) throw new Error('소환사 상세조회 실패 (HTTP 404)');
    const encryptedId = summonerData.id;
    const level = summonerData.summonerLevel;
    const iconId = summonerData.profileIconId;

    // 3. Ranked entries (League-V4)
    interface RiotLeagueEntry { queueType: string; tier: string; rank: string; leaguePoints: number; wins: number; losses: number; }
    const leagueData = await searchGet<RiotLeagueEntry[]>(
      `${proxy}https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedId}?api_key=${apiKey}`
    );
    const soloEntry = leagueData?.find(e => e.queueType === 'RANKED_SOLO_5x5') ?? leagueData?.[0];

    // 4. Champion masteries (Champion-Mastery-V4)
    interface SearchRiotMastery { championId: number; championLevel: number; championPoints: number; lastPlayTime: number; }
    let topMasteries: ChampionMastery[] = [];
    try {
      const masteryData = await searchGet<SearchRiotMastery[]>(
        `${proxy}https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=3&api_key=${apiKey}`
      );
      if (masteryData) {
        topMasteries = masteryData.map(m => ({
          championId: m.championId,
          championName: CHAMPION_ID_MAP[m.championId] || 'Ezreal',
          championLevel: m.championLevel,
          championPoints: m.championPoints,
          lastPlayTime: m.lastPlayTime
        }));
      }
    } catch (masteryErr) {
      console.warn('Failed to fetch masteries during search, skipping', masteryErr);
    }

    return {
      gameName: finalGameName,
      tagLine: finalTagLine,
      summonerLevel: level,
      profileIconId: iconId,
      tier: soloEntry ? soloEntry.tier : 'UNRANKED',
      rank: soloEntry ? soloEntry.rank : '',
      leaguePoints: soloEntry ? soloEntry.leaguePoints : 0,
      wins: soloEntry ? soloEntry.wins : 0,
      losses: soloEntry ? soloEntry.losses : 0,
      championMasteries: topMasteries.length > 0 ? topMasteries : undefined
    };
  };

  // Automatically fetch real Riot API data when toggling to Real Mode
  useEffect(() => {
    if (apiMode === 'real' && apiKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchRealRiotData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiMode, apiKey]);

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

    // Prepopulate champion masteries for Simulation Mode
    const mockChamps = ['Ezreal', 'Aatrox', 'LeeSin', 'Lulu', 'Yasuo', 'Lux'];
    const shuffledChamps = [...mockChamps].sort(() => 0.5 - Math.random());
    newMember.championMasteries = [
      {
        championId: 81,
        championName: shuffledChamps[0],
        championLevel: 7,
        championPoints: Math.floor(Math.random() * 300000) + 100000,
        lastPlayTime: Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
      },
      {
        championId: 266,
        championName: shuffledChamps[1],
        championLevel: 6,
        championPoints: Math.floor(Math.random() * 90000) + 30000,
        lastPlayTime: Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
      },
      {
        championId: 64,
        championName: shuffledChamps[2],
        championLevel: 5,
        championPoints: Math.floor(Math.random() * 40000) + 10000,
        lastPlayTime: Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
      }
    ];

    // Prepopulate realistic matches matching their registered settings using generateMockMatch
    const chosenChamp = shuffledChamps[0];
    newMember.matches = Array.from({ length: 4 }, (_, idx) => {
      const isWin = Math.random() > 0.45;
      return generateMockMatch(
        Math.random().toString(36).substring(2, 9),
        newMemberData.gameName,
        newMemberData.tagLine,
        chosenChamp,
        isWin,
        'MID',
        (idx + 1) * 3
      );
    });

    setMembers(prev => [newMember, ...prev]);

    // If real API mode is active, trigger a background fetch to get their actual level/tier/matches
    if (apiMode === 'real' && apiKey) {
      setTimeout(() => {
        fetchRealRiotData(newMember);
      }, 50);
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
              <span>{apiError}</span>
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
            onSearchMember={handleSearchMember}
            apiMode={apiMode}
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
