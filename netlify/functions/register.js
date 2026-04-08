exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = '50bda5cb399942588abcbb8ec6b6c474';

  if (!NOTION_TOKEN) return { statusCode: 500, headers, body: JSON.stringify({ error: 'NOTION_TOKEN 환경변수 없음' }) };

  const d = JSON.parse(event.body || '{}');
  const today = new Date().toISOString().split('T')[0];

  const notionBody = {
    parent: { database_id: DATABASE_ID },
    properties: {
      '상호명': { title: [{text:{content:d.bizName||''}}] },
      '사업자등록번호': { rich_text: [{text:{content:d.bizNum||''}}] },
      '대표자명': { rich_text: [{text:{content:d.repName||''}}] },
      '연락처': { phone_number: d.phone||null },
      '이메일': { email: d.email||null },
      '구분': { select: {name: d.bizType==='personal'?'개인사업자':'법인사업자'} },
      '계약유형': { select: {name: d.contract||'기장'} },
      '과세유형': { select: {name: d.tax||'일반과세'} },
      '기장시작일': { date: {start: today} },
      '담당자': { select: {name: '유진영'} },
      '유지여부': { select: {name: '활성'} },
    },
    children: [
      { object:'block', type:'heading_2', heading_2:{ rich_text:[{text:{content:'🔐 홈택스 정보'}}] } },
      { object:'block', type:'paragraph', paragraph:{ rich_text:[{text:{content:`홈택스 ID: ${d.htxId||'미입력'} / PW: ${d.htxPw||'미입력'} / 이전 세무대리인: ${d.prevAgent||'없음'}`}}] } },
      { object:'block', type:'heading_2', heading_2:{ rich_text:[{text:{content:'🏦 CMS 계좌 정보'}}] } },
      { object:'block', type:'paragraph', paragraph:{ rich_text:[{text:{content:`월 기장료: ${d.fee||'미입력'}원 / 출금일: 매월 ${d.cmsDay||'25'}일 / 은행: ${d.bank||'미입력'} / 계좌: ${d.account||'미입력'} / 예금주: ${d.accountName||'미입력'} / 생년월일/사업자번호: ${d.birthOrBizNum||'미입력'}`}}] } },
      { object:'block', type:'heading_2', heading_2:{ rich_text:[{text:{content:'👥 직원 현황'}}] } },
      { object:'block', type:'paragraph', paragraph:{ rich_text:[{text:{content:`직원 유무: ${d.hasEmp?'있음':'없음'} / 정규직: ${d.empCount||0}명 / 4대보험: ${d.insurance||'해당없음'}`}}] } },
      { object:'block', type:'heading_2', heading_2:{ rich_text:[{text:{content:'📝 메모'}}] } },
      { object:'block', type:'paragraph', paragraph:{ rich_text:[{text:{content:''}}] } },
    ]
  };

  try {
    const r = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${NOTION_TOKEN}`, 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28' },
      body: JSON.stringify(notionBody)
    });
    const result = await r.json();
    if (r.ok) return { statusCode: 200, headers, body: JSON.stringify({ success: true, pageId: result.id }) };
    return { statusCode: r.status, headers, body: JSON.stringify({ error: result.message || 'Notion API 오류' }) };
  } catch(e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
