import type { Member, MatchHistory, ActiveGame, MatchPlayer } from './types';

// Helper to generate a random ID
const genId = () => Math.random().toString(36).substring(2, 9);

// Champions list for mock data
export const CHAMPIONS = [
  'Aatrox', 'Ahri', 'Akali', 'Alistar', 'Amumu', 'Anivia', 'Annie', 'Aphelios', 'Ashe', 'AurelionSol',
  'Azir', 'Bard', 'BelVeth', 'Blitzcrank', 'Brand', 'Braum', 'Briar', 'Caitlyn', 'Camille', 'Cassiopeia',
  'ChoGath', 'Corki', 'Darius', 'Diana', 'DrMundo', 'Draven', 'Ekko', 'Elise', 'Evelynn', 'Ezreal',
  'Fiddlesticks', 'Fiora', 'Fizz', 'Galio', 'Gangplank', 'Garen', 'Gnar', 'Gragas', 'Graves', 'Gwen',
  'Hecarim', 'Heimerdinger', 'Hwei', 'Illaoi', 'Irelia', 'Ivern', 'Janna', 'JarvanIV', 'Jax', 'Jayce',
  'Jhin', 'Jinx', 'Kaisa', 'Kalista', 'Karma', 'Karthus', 'Kassadin', 'Katarina', 'Kayle', 'Kayn',
  'Kennen', 'Khazix', 'Kindred', 'Kled', 'KogMaw', 'Leblanc', 'LeeSin', 'Leona', 'Lillia', 'Lissandra',
  'Lucian', 'Lulu', 'Lux', 'Malphite', 'Malzahar', 'Maokai', 'MasterYi', 'Milio', 'MissFortune', 'Mordekaiser',
  'Morgana', 'Naafiri', 'Nami', 'Nasus', 'Nautilus', 'Neeko', 'Nidalee', 'Nilah', 'Nocturne', 'Nunu',
  'Olaf', 'Orianna', 'Ornn', 'Pantheon', 'Poppy', 'Pyke', 'Qiyana', 'Quinn', 'Rakan', 'Rammus',
  'RekSai', 'Rell', 'Renata', 'Renekton', 'Rengar', 'Riven', 'Rumble', 'Ryze', 'Samira', 'Sejuani',
  'Senna', 'Seraphine', 'Sett', 'Shaco', 'Shen', 'Shyvana', 'Singed', 'Sion', 'Sivir', 'Skarner',
  'Sona', 'Soraka', 'Swain', 'Sylas', 'Syndra', 'TahmKench', 'Taliyah', 'Talon', 'Taric', 'Teemo',
  'Thresh', 'Tristana', 'Trundle', 'Tryndamere', 'TwistedFate', 'Twitch', 'Udyr', 'Urgot', 'Varus', 'Vayne',
  'Veigar', 'VelKoz', 'Vex', 'Vi', 'Viego', 'Viktor', 'Vladimir', 'Volibear', 'Warwick', 'Wukong',
  'Xayah', 'Xerath', 'XinZhao', 'Yasuo', 'Yone', 'Yorick', 'Yuumi', 'Zac', 'Zed', 'Zeri',
  'Ziggs', 'Zilean', 'Zoe', 'Zyra'
];

// Helper to generate a realistic Match Player
const createMockMatchPlayer = (gameName: string, tagLine: string, champion: string, win: boolean, role: string): MatchPlayer => {
  let kills: number, deaths: number, assists: number;
  if (win) {
    kills = Math.floor(Math.random() * 8) + 4;
    deaths = Math.floor(Math.random() * 4) + 1;
    assists = Math.floor(Math.random() * 12) + 6;
  } else {
    kills = Math.floor(Math.random() * 5) + 1;
    deaths = Math.floor(Math.random() * 8) + 4;
    assists = Math.floor(Math.random() * 6) + 2;
  }

  return {
    gameName,
    tagLine,
    championName: champion,
    championId: Math.floor(Math.random() * 150) + 1,
    kills,
    deaths,
    assists,
    win,
    totalMinionsKilled: Math.floor(Math.random() * 120) + (role === 'ADC' || role === 'MID' || role === 'TOP' ? 120 : 20),
    goldEarned: Math.floor(Math.random() * 8000) + 7000,
    itemIds: Array.from({ length: 6 }, () => Math.floor(Math.random() * 1000) + 3000)
  };
};

// Helper to generate a complete Match History item
export const generateMockMatch = (
  matchId: string,
  userGameName: string,
  userTagLine: string,
  userChampion: string,
  win: boolean,
  role: string,
  timeOffsetHours: number
): MatchHistory => {
  const duration = Math.floor(Math.random() * 600) + 1200; // 20 - 30 minutes
  const timestamp = Date.now() - timeOffsetHours * 60 * 60 * 1000;
  
  // Create all 10 players
  const allies: MatchPlayer[] = [
    createMockMatchPlayer(userGameName, userTagLine, userChampion, win, role)
  ];
  
  const lobbyNames = [
    { name: '재망호 선장', tag: 'KR1' },
    { name: '망골숲 전사', tag: 'KR2' },
    { name: '골렘 슬레이어', tag: 'KR3' },
    { name: '환채 가이드', tag: 'KR4' },
    { name: '메플고수 롤하수', tag: 'KR5' },
    { name: '돌망호 선원', tag: 'KR6' },
  ].filter(p => p.name !== userGameName);

  // Fill in other allies (maybe some are from our guild!)
  for (let i = 0; i < 4; i++) {
    const isGuildMember = Math.random() < 0.35 && lobbyNames.length > 0;
    let name = `소환사${i + 1}`;
    let tag = 'KR1';
    if (isGuildMember) {
      const idx = Math.floor(Math.random() * lobbyNames.length);
      const chosen = lobbyNames.splice(idx, 1)[0];
      name = chosen.name;
      tag = chosen.tag;
    }
    const champ = CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];
    allies.push(createMockMatchPlayer(name, tag, champ, win, 'OTHER'));
  }

  // Create enemies
  const enemies: MatchPlayer[] = Array.from({ length: 5 }, (_, i) => {
    const champ = CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];
    return createMockMatchPlayer(`상대소환사${i + 1}`, 'KR2', champ, !win, 'OTHER');
  });

  const allPlayers = [...allies, ...enemies];
  const userStats = allies[0];

  return {
    matchId,
    gameMode: 'CLASSIC',
    gameDuration: duration,
    gameCreation: timestamp,
    championName: userChampion,
    kills: userStats.kills,
    deaths: userStats.deaths,
    assists: userStats.assists,
    win,
    cs: userStats.totalMinionsKilled,
    gold: userStats.goldEarned,
    items: userStats.itemIds,
    allPlayers
  };
};

// INITIAL SQUAD DATA
export const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    gameName: '재망호 선장',
    tagLine: 'KR1',
    summonerLevel: 324,
    profileIconId: 12,
    tier: 'MASTER',
    rank: 'I',
    leaguePoints: 215,
    wins: 142,
    losses: 120,
    activeGame: null,
    matches: []
  },
  {
    id: '2',
    gameName: '망골숲 전사',
    tagLine: 'KR2',
    summonerLevel: 254,
    profileIconId: 588,
    tier: 'DIAMOND',
    rank: 'II',
    leaguePoints: 48,
    wins: 118,
    losses: 110,
    activeGame: null,
    matches: []
  },
  {
    id: '3',
    gameName: '골렘 슬레이어',
    tagLine: 'KR3',
    summonerLevel: 189,
    profileIconId: 742,
    tier: 'EMERALD',
    rank: 'I',
    leaguePoints: 92,
    wins: 95,
    losses: 88,
    activeGame: null,
    matches: []
  },
  {
    id: '4',
    gameName: '환채 가이드',
    tagLine: 'KR4',
    summonerLevel: 152,
    profileIconId: 1044,
    tier: 'GOLD',
    rank: 'III',
    leaguePoints: 12,
    wins: 76,
    losses: 74,
    activeGame: null,
    matches: []
  },
  {
    id: '5',
    gameName: '메플고수 롤하수',
    tagLine: 'KR5',
    summonerLevel: 98,
    profileIconId: 300,
    tier: 'SILVER',
    rank: 'IV',
    leaguePoints: 75,
    wins: 42,
    losses: 58,
    activeGame: null,
    matches: []
  },
  {
    id: '6',
    gameName: '돌망호 선원',
    tagLine: 'KR6',
    summonerLevel: 212,
    profileIconId: 121,
    tier: 'PLATINUM',
    rank: 'II',
    leaguePoints: 50,
    wins: 89,
    losses: 82,
    activeGame: null,
    matches: []
  }
];

// Prepopulate matches for each initial member
const populateMockMatches = () => {
  // Captain (Lee Sin / Graves, Master jungle)
  INITIAL_MEMBERS[0].matches = [
    generateMockMatch(genId(), '재망호 선장', 'KR1', 'LeeSin', true, 'JUNGLE', 1),
    generateMockMatch(genId(), '재망호 선장', 'KR1', 'Graves', true, 'JUNGLE', 4),
    generateMockMatch(genId(), '재망호 선장', 'KR1', 'LeeSin', false, 'JUNGLE', 8),
    generateMockMatch(genId(), '재망호 선장', 'KR1', 'Viego', true, 'JUNGLE', 12),
    generateMockMatch(genId(), '재망호 선장', 'KR1', 'Graves', false, 'JUNGLE', 24),
  ];

  // Golem Hunter (Garen / Aatrox top)
  INITIAL_MEMBERS[1].matches = [
    generateMockMatch(genId(), '망골숲 전사', 'KR2', 'Garen', false, 'TOP', 2),
    generateMockMatch(genId(), '망골숲 전사', 'KR2', 'Aatrox', true, 'TOP', 5),
    generateMockMatch(genId(), '망골숲 전사', 'KR2', 'Garen', true, 'TOP', 7),
    generateMockMatch(genId(), '망골숲 전사', 'KR2', 'Darius', false, 'TOP', 15),
    generateMockMatch(genId(), '망골숲 전사', 'KR2', 'Aatrox', true, 'TOP', 18),
  ];

  // Golem Slayer (Ezreal / Kaisa ADC)
  INITIAL_MEMBERS[2].matches = [
    generateMockMatch(genId(), '골렘 슬레이어', 'KR3', 'Ezreal', true, 'ADC', 2),
    generateMockMatch(genId(), '골렘 슬레이어', 'KR3', 'Kaisa', false, 'ADC', 3),
    generateMockMatch(genId(), '골렘 슬레이어', 'KR3', 'Ezreal', true, 'ADC', 6),
    generateMockMatch(genId(), '골렘 슬레이어', 'KR3', 'Caitlyn', true, 'ADC', 14),
    generateMockMatch(genId(), '골렘 슬레이어', 'KR3', 'Kaisa', false, 'ADC', 20),
  ];

  // Suppporter (Thresh / Lulu support)
  INITIAL_MEMBERS[3].matches = [
    generateMockMatch(genId(), '환채 가이드', 'KR4', 'Lulu', true, 'SUPPORT', 1),
    generateMockMatch(genId(), '환채 가이드', 'KR4', 'Thresh', false, 'SUPPORT', 6),
    generateMockMatch(genId(), '환채 가이드', 'KR4', 'Lulu', false, 'SUPPORT', 9),
    generateMockMatch(genId(), '환채 가이드', 'KR4', 'Lux', true, 'SUPPORT', 13),
    generateMockMatch(genId(), '환채 가이드', 'KR4', 'Thresh', true, 'SUPPORT', 25),
  ];

  // Noob (Yasuo / Yone mid, high deaths)
  INITIAL_MEMBERS[4].matches = [
    generateMockMatch(genId(), '메플고수 롤하수', 'KR5', 'Yasuo', false, 'MID', 1),
    generateMockMatch(genId(), '메플고수 롤하수', 'KR5', 'Yone', false, 'MID', 3),
    generateMockMatch(genId(), '메플고수 롤하수', 'KR5', 'Yasuo', true, 'MID', 10),
    generateMockMatch(genId(), '메플고수 롤하수', 'KR5', 'Yasuo', false, 'MID', 14),
    generateMockMatch(genId(), '메플고수 롤하수', 'KR5', 'Yone', false, 'MID', 22),
  ];
  // Tweak Noob stats to make them funny (high deaths!)
  INITIAL_MEMBERS[4].matches.forEach(m => {
    m.deaths = Math.floor(Math.random() * 6) + 10; // 10-15 deaths
    m.kills = Math.floor(Math.random() * 4) + 1;
    m.assists = Math.floor(Math.random() * 5);
  });

  // Crew (Ahri / Lux mid)
  INITIAL_MEMBERS[5].matches = [
    generateMockMatch(genId(), '돌망호 선원', 'KR6', 'Ahri', true, 'MID', 3),
    generateMockMatch(genId(), '돌망호 선원', 'KR6', 'Lux', false, 'MID', 4),
    generateMockMatch(genId(), '돌망호 선원', 'KR6', 'Ahri', true, 'MID', 11),
    generateMockMatch(genId(), '돌망호 선원', 'KR6', 'Orianna', true, 'MID', 16),
    generateMockMatch(genId(), '돌망호 선원', 'KR6', 'Ahri', false, 'MID', 28),
  ];
};

// Prepopulate champion masteries for each initial member
const populateMockMasteries = () => {
  // Captain (Lee Sin, Graves, Viego)
  INITIAL_MEMBERS[0].championMasteries = [
    { championId: 64, championName: 'LeeSin', championLevel: 7, championPoints: 852100, lastPlayTime: Date.now() - 2 * 60 * 60 * 1000 },
    { championId: 104, championName: 'Graves', championLevel: 7, championPoints: 432000, lastPlayTime: Date.now() - 24 * 60 * 60 * 1000 },
    { championId: 234, championName: 'Viego', championLevel: 6, championPoints: 185500, lastPlayTime: Date.now() - 48 * 60 * 60 * 1000 }
  ];

  // Golem Hunter (Garen, Aatrox, Darius)
  INITIAL_MEMBERS[1].championMasteries = [
    { championId: 86, championName: 'Garen', championLevel: 7, championPoints: 542000, lastPlayTime: Date.now() - 4 * 60 * 60 * 1000 },
    { championId: 266, championName: 'Aatrox', championLevel: 6, championPoints: 298000, lastPlayTime: Date.now() - 18 * 60 * 60 * 1000 },
    { championId: 122, championName: 'Darius', championLevel: 5, championPoints: 124000, lastPlayTime: Date.now() - 5 * 24 * 60 * 60 * 1000 }
  ];

  // Golem Slayer (Ezreal, Kaisa, Caitlyn)
  INITIAL_MEMBERS[2].championMasteries = [
    { championId: 81, championName: 'Ezreal', championLevel: 7, championPoints: 673000, lastPlayTime: Date.now() - 1 * 60 * 60 * 1000 },
    { championId: 145, championName: 'Kaisa', championLevel: 6, championPoints: 320000, lastPlayTime: Date.now() - 36 * 60 * 60 * 1000 },
    { championId: 51, championName: 'Caitlyn', championLevel: 5, championPoints: 112000, lastPlayTime: Date.now() - 6 * 24 * 60 * 60 * 1000 }
  ];

  // Supporter (Lulu, Thresh, Lux)
  INITIAL_MEMBERS[3].championMasteries = [
    { championId: 117, championName: 'Lulu', championLevel: 7, championPoints: 480000, lastPlayTime: Date.now() - 12 * 60 * 60 * 1000 },
    { championId: 412, championName: 'Thresh', championLevel: 7, championPoints: 352000, lastPlayTime: Date.now() - 3 * 24 * 60 * 60 * 1000 },
    { championId: 99, championName: 'Lux', championLevel: 4, championPoints: 95000, lastPlayTime: Date.now() - 8 * 24 * 60 * 60 * 1000 }
  ];

  // Noob (Yasuo, Yone, MasterYi)
  INITIAL_MEMBERS[4].championMasteries = [
    { championId: 157, championName: 'Yasuo', championLevel: 7, championPoints: 1240000, lastPlayTime: Date.now() - 10 * 60 * 60 * 1000 },
    { championId: 777, championName: 'Yone', championLevel: 6, championPoints: 412000, lastPlayTime: Date.now() - 1 * 24 * 60 * 60 * 1000 },
    { championId: 11, championName: 'MasterYi', championLevel: 3, championPoints: 54000, lastPlayTime: Date.now() - 14 * 24 * 60 * 60 * 1000 }
  ];

  // Crew (Ahri, Lux, Orianna)
  INITIAL_MEMBERS[5].championMasteries = [
    { championId: 103, championName: 'Ahri', championLevel: 6, championPoints: 310000, lastPlayTime: Date.now() - 8 * 60 * 60 * 1000 },
    { championId: 99, championName: 'Lux', championLevel: 6, championPoints: 215000, lastPlayTime: Date.now() - 2 * 24 * 60 * 60 * 1000 },
    { championId: 61, championName: 'Orianna', championLevel: 4, championPoints: 89000, lastPlayTime: Date.now() - 10 * 24 * 60 * 60 * 1000 }
  ];
};

populateMockMatches();
populateMockMasteries();

// Generate an active game state for a player
export const generateActiveGame = (gameName: string, tagLine: string): ActiveGame => {
  const currentChamp = CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];
  const duration = Math.floor(Math.random() * 300) + 120; // 2 - 7 minutes started
  
  // Custom alliance team including the player and potentially other guild members
  const teamPlayers = [
    { gameName, tagLine, championName: currentChamp, isAlly: true }
  ];

  const candidateAllies = [
    { name: '재망호 선장', tag: 'KR1' },
    { name: '망골숲 전사', tag: 'KR2' },
    { name: '골렘 슬레이어', tag: 'KR3' },
    { name: '환채 가이드', tag: 'KR4' },
    { name: '메플고수 롤하수', tag: 'KR5' },
    { name: '돌망호 선원', tag: 'KR6' },
  ].filter(p => p.name !== gameName);

  // Fill ally team
  for (let i = 0; i < 4; i++) {
    const isGuildMember = Math.random() < 0.4 && candidateAllies.length > 0;
    let name = `소환사A${i + 1}`;
    let tag = 'KR1';
    if (isGuildMember) {
      const idx = Math.floor(Math.random() * candidateAllies.length);
      const chosen = candidateAllies.splice(idx, 1)[0];
      name = chosen.name;
      tag = chosen.tag;
    }
    const champ = CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];
    teamPlayers.push({ gameName: name, tagLine: tag, championName: champ, isAlly: true });
  }

  // Fill enemy team
  for (let i = 0; i < 5; i++) {
    const champ = CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];
    teamPlayers.push({ gameName: `적소환사${i + 1}`, tagLine: 'KR2', championName: champ, isAlly: false });
  }

  return {
    gameId: Math.floor(Math.random() * 90000000) + 10000000,
    gameLength: duration,
    gameStartTime: Date.now() - duration * 1000,
    championName: currentChamp,
    mapId: 11, // Summoner's Rift
    gameMode: 'CLASSIC',
    teamPlayers
  };
};

// Dynamic Simualtion Update
export const tickSimulation = (members: Member[]): Member[] => {
  return members.map(member => {
    // If they have an active game, increment the length by 5 seconds
    if (member.activeGame) {
      const updatedGame = {
        ...member.activeGame,
        gameLength: member.activeGame.gameLength + 5
      };

      // Randomly end the game (5% chance every tick)
      if (Math.random() < 0.05 && updatedGame.gameLength > 600) {
        const isWin = Math.random() > 0.45;
        const newMatch = generateMockMatch(
          updatedGame.gameId.toString(),
          member.gameName,
          member.tagLine,
          updatedGame.championName,
          isWin,
          'MID', // default
          0
        );

        // Update member stats
        const lpChange = isWin ? Math.floor(Math.random() * 8) + 15 : -(Math.floor(Math.random() * 6) + 12);
        let newLp = member.leaguePoints + lpChange;
        let newTier = member.tier;
        let newRank = member.rank;

        if (newLp >= 100) {
          if (member.tier === 'MASTER' || member.tier === 'GRANDMASTER' || member.tier === 'CHALLENGER') {
            // Master+ just goes up
          } else {
            newLp = 0;
            // Promote rank or tier
            if (member.rank === 'I') {
              newRank = 'IV';
              newTier = promoteTier(member.tier);
            } else {
              newRank = promoteRank(member.rank);
            }
          }
        } else if (newLp < 0) {
          if (member.tier === 'MASTER' || member.tier === 'GRANDMASTER' || member.tier === 'CHALLENGER') {
            newLp = 0; // demotion protection for master
          } else {
            newLp = 75;
            if (member.rank === 'IV') {
              newRank = 'I';
              newTier = demoteTier(member.tier);
            } else {
              newRank = demoteRank(member.rank);
            }
          }
        }

        return {
          ...member,
          wins: member.wins + (isWin ? 1 : 0),
          losses: member.losses + (isWin ? 0 : 1),
          leaguePoints: newLp,
          tier: newTier,
          rank: newRank,
          activeGame: null,
          matches: [newMatch, ...member.matches.slice(0, 9)] // keep last 10
        };
      }

      return {
        ...member,
        activeGame: updatedGame
      };
    } else {
      // If they are not in a game, they have a 2% chance to start a new one
      if (Math.random() < 0.02) {
        return {
          ...member,
          activeGame: generateActiveGame(member.gameName, member.tagLine)
        };
      }
    }

    return member;
  });
};

const promoteTier = (tier: string): string => {
  const tiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER'];
  const idx = tiers.indexOf(tier);
  return idx < tiers.length - 1 ? tiers[idx + 1] : tier;
};

const demoteTier = (tier: string): string => {
  const tiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER'];
  const idx = tiers.indexOf(tier);
  return idx > 0 ? tiers[idx - 1] : tier;
};

const promoteRank = (rank: string): string => {
  const ranks = ['IV', 'III', 'II', 'I'];
  const idx = ranks.indexOf(rank);
  return idx < ranks.length - 1 ? ranks[idx + 1] : rank;
};

const demoteRank = (rank: string): string => {
  const ranks = ['IV', 'III', 'II', 'I'];
  const idx = ranks.indexOf(rank);
  return idx > 0 ? ranks[idx - 1] : rank;
};


// Help map tiers to rank power (for sorting)
export const getTierOrder = (tier: string): number => {
  const order: { [key: string]: number } = {
    'CHALLENGER': 10,
    'GRANDMASTER': 9,
    'MASTER': 8,
    'DIAMOND': 7,
    'EMERALD': 6,
    'PLATINUM': 5,
    'GOLD': 4,
    'SILVER': 3,
    'BRONZE': 2,
    'IRON': 1
  };
  return order[tier] || 0;
};

export const getRankOrder = (rank: string): number => {
  const order: { [key: string]: number } = {
    'I': 4,
    'II': 3,
    'III': 2,
    'IV': 1
  };
  return order[rank] || 0;
};

export const getTierLabelKR = (tier: string): string => {
  const label: { [key: string]: string } = {
    'CHALLENGER': '챌린저',
    'GRANDMASTER': '그랜드마스터',
    'MASTER': '마스터',
    'DIAMOND': '다이아몬드',
    'EMERALD': '에메랄드',
    'PLATINUM': '플래티넘',
    'GOLD': '골드',
    'SILVER': '실버',
    'BRONZE': '브론즈',
    'IRON': '아이언'
  };
  return label[tier] || tier;
};

export const getTierColor = (tier: string): string => {
  const colors: { [key: string]: string } = {
    'CHALLENGER': '#f48c06',
    'GRANDMASTER': '#d90429',
    'MASTER': '#c77dff',
    'DIAMOND': '#00b4d8',
    'EMERALD': '#00ed64',
    'PLATINUM': '#4ea8de',
    'GOLD': '#ffb703',
    'SILVER': '#adb5bd',
    'BRONZE': '#9d4edd',
    'IRON': '#6c757d'
  };
  return colors[tier] || '#ffffff';
};
