export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = '50bda5cb399942588abcbb8ec6b6c474';

  if (!NOTION_TOKEN) return res.status(500).json({ error: 'NOTION_TOKEN 환경변수 없음' });

  const d = req.body;
  const today = new Date().toISOString().split('T')[0];

  const children = [
    { object:'block', type:'heading_2', heading_2:{ rich_text:[{text:{content:'🔐 홈택스 정보'}}] } },
    { object:'block', type:'table', table:{ table_width:2, has_column_header:true, has_row_header:false, children:[
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'항목'}}],[{text:{content:'내용'}}]] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'홈택스 ID'}}],[{text:{content:d.htxId||'미입력'}}]] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'홈택스 PW'}}],[{text:{content:d.htxPw||'미입력'}}]] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'이전 세무대리인'}}],[{text:{content:d.prevAgent||'없음'}}]] } },
    ]}},
    { object:'block', type:'heading_2', heading_2:{ rich_text:[{text:{content:'🏦 CMS 계좌 정보'}}] } },
    { object:'block', type:'table', table:{ table_width:2, has_column_header:true, has_row_header:false, children:[
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'항목'}}],[{text:{content:'내용'}}]] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'월 기장료'}}],[{text:{content:d.fee||'미입력'}}]] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'출금일'}}],[{text:{content:d.cmsDay||'25'}}+'일']] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'은행'}}],[{text:{content:d.bank||'미입력'}}]] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'계좌번호'}}],[{text:{content:d.account||'미입력'}}]] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'예금주'}}],[{text:{content:d.accountName||'미입력'}}]] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'생년월일/사업자번호'}}],[{text:{content:d.birthOrBizNum||'미입력'}}]] } },
    ]}},
    { object:'block', type:'heading_2', heading_2:{ rich_text:[{text:{content:'👥 직원 현황'}}] } },
    { object:'block', type:'table', table:{ table_width:2, has_column_header:true, has_row_header:false, children:[
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'항목'}}],[{text:{content:'내용'}}]] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'직원 유무'}}],[{text:{content:d.hasEmp?'있음':'없음'}}]] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'정규직 인원'}}],[{text:{content:String(d.empCount||0)+'명'}}]] } },
      { object:'block', type:'table_row', table_row:{ cells:[[{text:{content:'4대보험'}}],[{text:{content:d.insurance||'해당없음'}}]] } },
    ]}},
    { object:'block', type:'heading_2', heading_2:{ rich_text:[{text:{content:'📝 메모'}}] } },
    { object:'block', type:'paragraph', paragraph:{ rich_text:[{text:{content:''}}] } },
  ];

  const body = {
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
      '직원유무': { checkbox: d.hasEmp===true },
      '직원수': { number: d.empCount||0 },
      '결산월': { select: {name: d.settleMonth||'12월'} },
      '기장시작일': { date: {start: today} },
      '담당자': { select: {name: '유진영'} },
      '유지여부': { select: {name: '활성'} },
    },
    children
  };

  try {
    const r = await fetch('https://api.notion.com/v1/pages', {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${NOTION_TOKEN}`, 'Content-Type':'application/json', 'Notion-Version':'2022-06-28' },
      body: JSON.stringify(body)
    });
    const result = await r.json();
    if(r.ok) return res.status(200).json({ success:true, pageId: result.id });
    return res.status(r.status).json({ error: result.message||'Notion API 오류' });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
