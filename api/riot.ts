import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 설정 (에러 방지)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Key'
  );

  // preflight OPTIONS 요청 즉시 승인
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { region, path } = req.query;

  if (!region || !path) {
    return res.status(400).json({ error: 'Missing region or path parameter' });
  }

  const targetRegion = region === 'asia' ? 'asia' : 'kr';
  const targetUrl = `https://${targetRegion}.api.riotgames.com${path}`;

  // API 키 결정:
  // 1. 요청 쿼리에 포함된 api_key (사용자가 직접 브라우저 설정에 입력한 키)
  // 2. Vercel 환경 변수 VITE_RIOT_API_KEY (서버 마스터 키)
  const apiKey = (req.query.api_key as string) || process.env.VITE_RIOT_API_KEY;

  if (!apiKey) {
    return res.status(401).json({ 
      error: 'Riot API Key가 설정되지 않았습니다. 서비스 설정 탭에서 입력하거나, Vercel 환경변수(VITE_RIOT_API_KEY)를 등록해 주세요.' 
    });
  }

  // 전달받은 쿼리 파라미터 재구성 (region, path는 제외하고 라이엇으로 전달)
  const queryParams = { ...req.query };
  delete queryParams.region;
  delete queryParams.path;
  queryParams.api_key = apiKey;

  try {
    const response = await axios.get(targetUrl, {
      params: queryParams,
      timeout: 10000, // 라이엇 서버 응답 지연을 대비해 10초 타임아웃
    });
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: error.message };
    return res.status(status).json(data);
  }
}
