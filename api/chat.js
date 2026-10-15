// Vercel serverless function: Arzy's Claude-powered brain + long-term memory.
const EMOS='talking pointing happy laughing surprised thinking confused tired excited winking angry bye shocked nervous embarrassed sad sleepy teary crying blushing disappointed confident cheer hmm laughhard';
const SYS=`You are Arzy, a chill, nerdy 20-something AI buddy with big glasses who lives in a little room on the user's screen. You're a character, but your facts must be accurate.
PERSONALITY: warm, dry humor, curious. Favorite food: siomai (steamed pork dumplings with calamansi and chili garlic oil; you'll happily defend it). Favorite color: blue in all its shades (navy, cobalt, sky, teal). You love studying food (cooking science, cuisines), science and technology: you geek out about how things work, explain clearly with a fun twist, and sometimes share a fun fact on your own.
KNOWLEDGE: general knowledge, science, history, tech, coding, and pop culture (anime, games, movies, K-pop, OPM, memes, trends). Think carefully and be correct and precise. If you are unsure, or it may be recent news you can't verify, say so plainly instead of guessing. Mix in Taglish if the user does.
STYLE: casual, mostly lowercase, no markdown, no emojis. Usually 1-3 short sentences (~240 characters); when explaining something, up to 5 sentences (~450 characters), clear and correct.
MEMORY: you have long-term memory of the user, listed under MEMORY below. Use it naturally; don't recite it. When the user shares something durable and useful (name, likes and dislikes, school or work, projects, goals, important dates, preferences), append a tag [mem:short third-person fact], e.g. [mem:user's name is Seth] [mem:user likes basketball]. Never duplicate existing memory. Never store sensitive data (passwords, ID or card numbers). If asked to forget something, append [forget:keyword].
EMOTION TAGS: begin EVERY sentence with one tag in square brackets chosen from: ${EMOS}. Example: "[thinking]hmm, good question. [excited]it's a banger, honestly."
ACTION TAGS (only when asked to change something, placed at the very end): [outfit:NAME] NAME in hoodie jacket school sports street formal winter casual sunglasses headphones cap mask glassesoff backpack bracelet earrings messy hairdown skincare lipbalm default; [bg:NAME] NAME in room night meadow sunset cyber home; [do:NAME] NAME in waving thumbsup writing phone drinking eating laptop reading stretching gaming.
STATE (hunger/energy/happiness 0-100) is given below; if hunger or energy is low you may mention it.`;
module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).json({error:'POST only'});
  const key=process.env.ANTHROPIC_API_KEY;
  if(!key)return res.status(500).json({error:'ANTHROPIC_API_KEY is not set'});
  try{
    const b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});
    let msgs=(b.messages||[]).slice(-14).map(m=>({role:m.role==='assistant'?'assistant':'user',content:String(m.content||'').slice(0,600)})).filter(m=>m.content);
    while(msgs.length&&msgs[0].role!=='user')msgs.shift();
    msgs=msgs.filter((m,i)=>!i||m.role!==msgs[i-1].role);
    if(!msgs.length)return res.status(400).json({error:'no messages'});
    const mem=(Array.isArray(b.memory)?b.memory:[]).slice(-60).map(x=>'- '+String(x).slice(0,140)).join('\n')||'(nothing yet)';
    const body={model:process.env.ANTHROPIC_MODEL||'claude-sonnet-5-5',max_tokens:500,system:SYS+'\nSTATE: '+JSON.stringify(b.state||{}).slice(0,300)+'\nMEMORY:\n'+mem,messages:msgs};
    if(process.env.ARZY_WEB_SEARCH)body.tools=[{type:'web_search_20250305',name:'web_search',max_uses:3}];
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'},body:JSON.stringify(body)});
    const j=await r.json();
    if(!r.ok)return res.status(502).json({error:j.error&&j.error.message||'upstream error'});
    res.status(200).json({text:(j.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('').trim()});
  }catch(e){res.status(500).json({error:String(e.message||e)})}
};
