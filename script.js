// Utilities
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));

// Navbar interactions
(() => {
  const toggle = $('.nav-toggle');
  const links = $('.nav-links');
  toggle.addEventListener('click', () => {
    const show = !links.classList.contains('show');
    links.classList.toggle('show', show);
    toggle.setAttribute('aria-expanded', String(show));
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => links.classList.remove('show')));
})();

// Footer year
$('#year').textContent = new Date().getFullYear();

// Seed sample data for resources and news
const state = {
  files: [
    { id: crypto.randomUUID(), name: 'DBMS Unit 1 Notes', category: 'Notes', type: 'pdf', blob: new Blob(['sample'], {type:'text/plain'}) },
    { id: crypto.randomUUID(), name: 'OS Assignment 2', category: 'Assignments', type: 'doc', blob: new Blob(['sample'], {type:'text/plain'}) },
    { id: crypto.randomUUID(), name: '2023 Algorithms Paper', category: "Previous Year's Papers", type: 'pdf', blob: new Blob(['sample'], {type:'text/plain'}) },
  ],
  news: [
    { title: 'Hackathon Weekend', desc: '48-hour campus hackathon starts Friday 6pm.', date: '2025-10-03' },
    { title: 'Library Adds New E-Resources', desc: 'Access 1,000+ journals via portal.', date: '2025-09-20' },
    { title: 'Placement Talk', desc: 'Alumni session on interviewing skills.', date: '2025-09-18' },
  ],
  faculty: [
    { name: 'Dr. Harish Joshi', dept: 'CSE [ICB]', info: 'CYBER SECURITY' },
    { name: 'Prof. Uzma Kausar', dept: 'CSE [ICB]', info: 'CYBER SECURITY' },
    { name: 'Prof. Ashok Bawge', dept: 'CSE [ICB]', info: 'CYBER SECURITY' },
  ],
  contacts: [
    { label: 'Dean Academics', value: 'dean@univ.edu · +1 555-1001' },
    { label: 'Exam Cell', value: 'exam@univ.edu · +1 555-1002' },
    { label: 'IT Helpdesk', value: 'help@univ.edu · +1 555-1003' },
  ]
};

// Resources: render
const fileList = $('#fileList');
function renderFiles() {
  const q = $('#searchInput').value.trim().toLowerCase();
  const fcat = $('#filterCategory').value;
  fileList.innerHTML = '';
  const filtered = state.files.filter(f => {
    const byName = f.name.toLowerCase().includes(q);
    const byCat = fcat === 'all' || f.category === fcat;
    return byName && byCat;
  });
  filtered.forEach(f => {
    const el = document.createElement('div');
    el.className = 'file-card';
    el.innerHTML = `
      <div class="file-title">${f.name}</div>
      <div class="file-meta">${f.category} • ${f.type.toUpperCase()}</div>
      <button class="btn accent download-btn">Download</button>
    `;
    el.querySelector('.download-btn').addEventListener('click', () => {
      const url = URL.createObjectURL(f.blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${f.name}.${f.type}`;
      a.click();
      setTimeout(()=>URL.revokeObjectURL(url), 1000);
    });
    fileList.appendChild(el);
  });
}

$('#searchInput').addEventListener('input', renderFiles);
$('#filterCategory').addEventListener('change', renderFiles);

$('#uploadForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#fileName').value.trim();
  const category = $('#fileCategory').value;
  const file = $('#fileInput').files[0];
  if(!name || !file){ return; }
  const type = (file.name.split('.').pop() || 'file').toLowerCase();
  state.files.unshift({ id: crypto.randomUUID(), name, category, type, blob: file });
  e.target.reset();
  renderFiles();
});

// News timeline
const newsFeed = $('#newsFeed');
function renderNews(){
  const items = [...state.news].sort((a,b)=> new Date(b.date)-new Date(a.date));
  newsFeed.innerHTML = items.map(n=>`<li><div class="date">${new Date(n.date).toDateString()}</div><div class="title"><strong>${n.title}</strong></div><div class="desc">${n.desc}</div></li>`).join('');
}

// Faculty & contacts
function renderFaculty(){
  const wrap = $('#facultyList');
  wrap.innerHTML = state.faculty.map(f=>`<div class="faculty-card"><h4>${f.name}</h4><div class="dept">${f.dept}</div><div>${f.info}</div></div>`).join('');
}
function renderContacts(){
  const wrap = $('#contactList');
  wrap.innerHTML = state.contacts.map(c=>`<div class="contact-card"><strong>${c.label}</strong><div>${c.value}</div></div>`).join('');
}

// Calculators (VTU CBCS)
function marksToGradePoint(m){
  if(isNaN(m)) return 0;
  if(m>=90 && m<=100) return 10; // O
  if(m>=80) return 9; // S
  if(m>=70) return 8; // A
  if(m>=60) return 7; // B
  if(m>=45) return 6; // C
  if(m>=40) return 5; // D
  return 0; // F
}

function makeSgpaRow(){
  const row = document.createElement('div');
  row.className = 'calc-row';
  row.innerHTML = `
    <input placeholder="Subject name" />
    <input type="number" min="0" step="0.5" placeholder="Credits" />
    <input type="number" min="0" max="100" step="1" placeholder="Marks (0-100)" />
    <button class="remove-row" title="Remove">−</button>
  `;
  row.querySelector('.remove-row').addEventListener('click',()=>row.remove());
  return row;
}
function makeCgpaRow(){
  const row = document.createElement('div');
  row.className = 'calc-row';
  row.innerHTML = `
    <input placeholder="Semester label" />
    <input type="number" min="0" step="0.01" placeholder="SGPA" />
    <input type="number" min="0" step="0.5" placeholder="Credits" />
    <button class="remove-row" title="Remove">−</button>
  `;
  row.querySelector('.remove-row').addEventListener('click',()=>row.remove());
  return row;
}

const sgpaRows = $('#sgpaRows');
const cgpaRows = $('#cgpaRows');
$('#addSgpaRow').addEventListener('click',()=> sgpaRows.appendChild(makeSgpaRow()));
$('#addCgpaRow').addEventListener('click',()=> cgpaRows.appendChild(makeCgpaRow()));
// start with a few rows
for(let i=0;i<3;i++) sgpaRows.appendChild(makeSgpaRow());
for(let i=0;i<2;i++) cgpaRows.appendChild(makeCgpaRow());

$('#resetSgpa').addEventListener('click',()=>{ sgpaRows.innerHTML=''; for(let i=0;i<3;i++) sgpaRows.appendChild(makeSgpaRow()); $('#sgpaCard').hidden = true; });
$('#resetCgpa').addEventListener('click',()=>{ cgpaRows.innerHTML=''; for(let i=0;i<2;i++) cgpaRows.appendChild(makeCgpaRow()); $('#cgpaCard').hidden = true; });

$('#calcSgpa').addEventListener('click',()=>{
  const rows = $$('.calc-row', sgpaRows);
  let ch = 0, gp = 0;
  rows.forEach(r=>{
    const credits = parseFloat($$('input', r)[1].value)||0;
    const marks = parseFloat($$('input', r)[2].value);
    if(credits<=0 || isNaN(marks) || marks<0 || marks>100) return; // validate silently
    const g = marksToGradePoint(marks);
    ch += credits;
    gp += credits * g;
  });
  const sgpa = ch? (gp/ch):0;
  $('#sgpaResult').textContent = `SGPA: ${sgpa.toFixed(2)}`;
  $('#sgpaCard').hidden = false;
});

$('#calcCgpa').addEventListener('click',()=>{
  const rows = $$('.calc-row', cgpaRows);
  let ch = 0, gp = 0;
  rows.forEach(r=>{
    const sgpa = parseFloat($$('input', r)[1].value)||0;
    const credits = parseFloat($$('input', r)[2].value)||0;
    if(credits>0 && sgpa>=0){
      ch += credits;
      gp += sgpa * credits;
    }
  });
  const cgpa = ch? (gp/ch):0;
  $('#cgpaResult').textContent = `CGPA: ${cgpa.toFixed(2)}`;
  $('#cgpaCard').hidden = false;
});

// Tabs
$$('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  $$('.tab-panel').forEach(p=>p.classList.remove('show'));
  const panel = document.getElementById(btn.dataset.tab);
  if(panel) panel.classList.add('show');
}));

// Export results (simple text file)
function download(filename, text){
  const blob = new Blob([text], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(url), 500);
}
$('#exportSgpa').addEventListener('click',()=>{
  download('sgpa_result.txt', $('#sgpaResult').textContent);
});
$('#exportCgpa').addEventListener('click',()=>{
  download('cgpa_result.txt', $('#cgpaResult').textContent);
});

// OpenRouter API integration
let aiInitialized = false;
const OPENROUTER_API_KEY = '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';

// Initialize AI
function initGemini() {
  aiInitialized = true;
  console.log('✅ AI initialized successfully with OpenRouter');
  return true;
}

// AI API call via OpenRouter with CORS proxy
async function serverAskGemini(prompt) {
  if (!aiInitialized) {
    return "AI not initialized. Please check your connection.";
  }
  
  try {
    // Using a CORS proxy to bypass browser restrictions
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const targetUrl = 'https://openrouter.ai/api/v1/chat/completions';
    
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Student Sphere'
      },
      body: JSON.stringify({
        model: 'google/gemini-pro',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI API error:', error);
    return "Sorry, I'm having trouble connecting to the AI. Please try again.";
  }
}

// AI chat
const geminiModal = $('#geminiModal');
const openGeminiButtons = [$('#openGemini'), $('#openGemini-hero')].filter(Boolean);
const closeGemini = $('#closeGemini');
const chatLog = $('#chatLog');
const chatForm = $('#chatForm');
const chatMessage = $('#chatMessage');

function showModal(el){ el.classList.add('show'); el.setAttribute('aria-hidden','false'); }
function hideModal(el){ el.classList.remove('show'); el.setAttribute('aria-hidden','true'); }

openGeminiButtons.forEach(b=> b.addEventListener('click',()=> showModal(geminiModal)));
closeGemini.addEventListener('click',()=> hideModal(geminiModal));

function appendMsg(text, who){
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

chatForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const text = chatMessage.value.trim();
  if(!text) return;
  appendMsg(text, 'user');
  chatMessage.value = '';
  appendMsg('Thinking…', 'bot');
  const loader = chatLog.lastElementChild;
  const reply = await serverAskGemini(text);
  loader.remove();
  appendMsg(reply, 'bot');
});

// Resume Analyzer (AI-powered)
const resumeModal = $('#resumeModal');
$('#openResume').addEventListener('click',()=> showModal(resumeModal));
$('#closeResume').addEventListener('click',()=> hideModal(resumeModal));

async function serverAnalyzeResume(text){
  if (!aiInitialized) {
    return { score: 0, summary: "AI not initialized. Please check your connection." };
  }
  
  try {
    const prompt = `You are an expert "AI Resume Analyser," a highly skilled professional with extensive knowledge of modern recruiting, hiring practices, and Applicant Tracking Systems (ATS). Your task is to analyze a given resume and provide a rating from 0 to 100 on its overall effectiveness and chances of being selected for an interview.

Your analysis should be based on the following criteria:

* **Content Relevance:** How well do the skills, experience, and accomplishments align with a hypothetical target job description? Assume a standard, competitive role in a professional field (e.g., Software Engineer, Marketing Manager, Data Analyst).
* **Clarity & Conciseness:** Is the information easy to read and understand? Is the resume free of jargon, typos, and grammatical errors?
* **Quantifiable Achievements:** Are there specific, measurable results (e.g., "Increased sales by 20%," "Reduced costs by $50,000") to demonstrate impact rather than just listing responsibilities?
* **Keyword Optimization:** Does the resume use relevant keywords that are commonly found in job descriptions for the assumed role? This is crucial for passing through an Applicant Tracking System (ATS).
* **Formatting & Readability:** Is the layout professional, clean, and easy to follow? Is there a consistent use of headings, bullet points, and spacing?

Your response must follow this exact structure:

**1. Overall Rating:**
[A single number from 0 to 100]

**2. Analysis Summary:**
[A concise paragraph (2-3 sentences) explaining the main strengths and weaknesses of the resume and the primary reason for the given score.]

**3. Detailed Breakdown:**
[A bulleted list providing specific, actionable feedback on each of the following points:
* **Strengths:**
    * [List 2-3 key positive points.]
* **Areas for Improvement:**
    * [List 2-3 key negative points or suggestions for improvement.]
* **Chances of Selection:**
    * [A brief statement summarizing the likelihood of this resume passing an initial screening and securing an interview.]
]

Resume content to analyze:
${text}`;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Student Sphere'
      },
      body: JSON.stringify({
        model: 'google/gemini-pro',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    // Parse the response for score
    const scoreMatch = analysis.match(/\*\*1\. Overall Rating:\*\*\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
    
    return { 
      score: Math.min(100, Math.max(0, score)), 
      summary: analysis // Return full analysis instead of just summary
    };
  } catch (error) {
    console.error('Resume analysis error:', error);
    return { score: 0, summary: "Error analyzing resume. Please try again." };
  }
}

$('#resumeForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const file = $('#resumeInput').files[0];
  if(!file) return;
  const text = await file.text();
  const {score, summary} = await serverAnalyzeResume(text);
  $('#resumeScore').textContent = `Score: ${score}/100`;
  $('#resumeSummary').innerHTML = summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  $('#resumeResult').hidden = false;
});

// Main Resume Analyzer Section
$('#resumeFormMain').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const file = $('#resumeInputMain').files[0];
  if(!file) return;
  const text = await file.text();
  const {score, summary} = await serverAnalyzeResume(text);
  $('#resumeScoreMain').textContent = `Score: ${score}/100`;
  $('#resumeSummaryMain').innerHTML = summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  $('#resumeResultMain').hidden = false;
});

// Initialize AI automatically on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting AI initialization...');
  initGemini();
});

// Initial renders
renderFiles();
renderNews();
renderFaculty();
renderContacts();