import { useEffect, useState } from 'react';
// --- ADDED SUPABASE IMPORT ---
import { supabase } from './supabaseClient'; 
import './App.css';

// --- SKILL ASSET IMPORTS ---
import htmlLogo from './assets/skills/html.png';
import cssLogo from './assets/skills/css.png';
import jsLogo from './assets/skills/js.png';
import outsystemsLogo from './assets/skills/outsystem.png';
import supabaseLogo from './assets/skills/supabase.png';
import mysqlLogo from './assets/skills/mysql.png';
import mongoLogo from './assets/skills/mongodb.png';
import flutterLogo from './assets/skills/flutter.png';
import reactLogo from './assets/skills/react.png';

// --- PROJECT ASSET IMPORTS ---
import happyPawsImg from './assets/projects/happypaws.png';
import parkingImg from './assets/projects/smartparking.jpg';

// --- SOCIAL ASSET IMPORTS ---
import githubIcon from './assets/socials/githubs.png';
import linkedinIcon from './assets/socials/linked.webp';
import emailIcon from './assets/socials/email.png';

// --- EDUCATION ASSET IMPORTS ---
import apcLogo from './assets/education/apc.png';
import eastLogo from './assets/education/east.jpg';
import tpaezLogo from './assets/education/tpaez.jpg';

// --- PROFILE ASSET IMPORT ---
import profileImg from './assets/profile/profile.jpg'; 

// --- GAME ASSET IMPORTS ---
import valorantImg from './assets/games/valorants.jpg';
import cs2Img from './assets/games/cs2.jpg';
import mlbbImg from './assets/games/mlbb.jpg';
import minecraftImg from './assets/games/minecrafts.png';
import wildriftImg from './assets/games/wildrift.jpg';
import cocImg from './assets/games/coc.jpg';
import robloxImg from './assets/games/roblox.png';
import hokImg from './assets/games/hok.jpg';

// --- STATIC DATA CONFIGURATION ---
const SKILLS = [
  { name: 'HTML', icon: htmlLogo },
  { name: 'CSS', icon: cssLogo },
  { name: 'JavaScript', icon: jsLogo },
  { name: 'React', icon: reactLogo },
  { name: 'Supabase', icon: supabaseLogo },
  { name: 'MySQL', icon: mysqlLogo },
  { name: 'MongoDB', icon: mongoLogo },
  { name: 'Flutter', icon: flutterLogo }
];

const GAMES = [
  { id: 1, title: 'Valorant', genre: 'Tactical Shooter', image: valorantImg },
  { id: 2, title: 'CS2', genre: 'FPS', image: cs2Img },
  { id: 3, title: 'Mobile Legends', genre: 'MOBA', image: mlbbImg },
  { id: 4, title: 'Minecraft', genre: 'Sandbox', image: minecraftImg },
  { id: 5, title: 'Wild Rift', genre: 'MOBA', image: wildriftImg },
  { id: 6, title: 'Clash of Clans', genre: 'Strategy', image: cocImg },
  { id: 7, title: 'Roblox', genre: 'Platform', image: robloxImg },
  { id: 8, title: 'Honor of Kings', genre: 'MOBA', image: hokImg }
];

const PROJECTS = [
  {
    id: 'happypaws',
    title: 'HappyPaws Clinic',
    desc: 'A comprehensive veterinary clinic management system utilizing a hybrid database architecture.',
    tech: ['PHP', 'MySQL', 'MongoDB'],
    image: happyPawsImg,
    reverse: false
  },
  {
    id: 'smartparking',
    title: 'Smart Parking System',
    desc: 'A physical multi-level smart parking prototype built with Arduino Uno R4.',
    tech: ['Arduino', 'C++'],
    image: parkingImg,
    reverse: true
  }
];

const EDUCATION = [
  { id: 'college', level: 'College (2024–Present)', school: 'Asia Pacific College', years: '2nd Year, BSIT', logo: apcLogo },
  { id: 'shs', level: 'Senior High School (2022–2024)', school: 'Asia Pacific College', years: 'Grade 11–12', logo: apcLogo },
  { id: 'jhs', level: 'Junior High School (2018–2022)', school: 'Pasay City East High School', years: 'Grade 7–10', logo: eastLogo },
  { id: 'elem', level: 'Elementary (2012–2018)', school: 'T-Paez Elementary School', years: 'Grade 1–6', logo: tpaezLogo }
];

const SOCIALS = [
  { id: 'github', platform: 'GitHub', link: 'https://github.com', image: githubIcon },
  { id: 'linkedin', platform: 'LinkedIn', link: 'https://linkedin.com', image: linkedinIcon },
  { id: 'email', platform: 'Email', link: 'mailto:jared@example.com', image: emailIcon }
];

function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [appLoading, setAppLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // --- MOUSE TRACKER ---
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('.interactive')) {
        setIsHovering(true);
      }
    };
    const handleMouseOut = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // --- SECTION OBSERVER ---
  useEffect(() => {
    if (appLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, [appLoading]);

  // --- FIXED DATA FETCHING (Using Supabase Client) ---
  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      const minimumLoadTime = new Promise(resolve => setTimeout(resolve, 1500));
      // Call Supabase fetch
      await Promise.all([minimumLoadTime, fetchEntries()]);
      setAppLoading(false);
    };
    initApp();
  }, []);

  // --- FIXED SUBMIT (Using Supabase Client) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('guestbook')
        .insert([{ name: form.name, message: form.message }]);

      if (error) throw error;

      setForm({ name: '', message: '' });
      await fetchEntries(); // Refresh feed
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">JG<span className="dot">.</span></div>
        <div className="loading-bar"><div className="loading-progress"></div></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div 
        className={`custom-cursor ${isHovering ? 'hovering' : ''}`} 
        style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
      ></div>

      <header className="navbar-wrapper fade-in-down">
        <nav className="navbar">
          <div className="nav-brand">JG.</div>
          <div className="nav-links-desktop">
            {['home', 'about', 'education', 'skills', 'games', 'projects', 'socials'].map(id => (
              <a key={id} href={`#${id}`} className={activeSection === id ? 'active' : ''}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
          <button className="hamburger-btn" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            <span className={`bar ${mobileNavOpen ? 'open' : ''}`}></span>
            <span className={`bar ${mobileNavOpen ? 'open' : ''}`}></span>
            <span className={`bar ${mobileNavOpen ? 'open' : ''}`}></span>
          </button>
        </nav>
      </header>

      <main className="main-content">
        {/* HERO */}
        <section id="home" className="hero-section fade-in-up">
          <div className="hero-box-outer">
            <div className="hero-status-bar">
              <div className="status-indicator"><span className="pulse-dot"></span> Available for new opportunities</div>
            </div>
            <div className="hero-top-text"><h2>HELLO,</h2><p>I am</p></div>
            <div className="hero-box-inner interactive-hero">
              <h1 className="hero-name">JARED<br /><span className="text-outline">GATCHALIAN</span></h1>
            </div>
            <div className="hero-bottom-area">
              <p className="hero-description">Full-Stack Developer & IT Student at APC.</p>
              <div className="hero-ctas">
                <a href="#projects" className="brutal-btn-primary interactive">View My Work</a>
                <a href="#guestbook" className="brutal-btn-secondary interactive">Sign Guestbook</a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="content-section fade-in-up">
          <div className="brutal-container">
            <div className="section-tab"><span className="icon">(!)</span> About</div>
            <div className="about-grid">
              <div className="about-content-wrapper">
                <div className="about-text-card">
                  <p className="about-lead">AUTHENTIC & DRIVEN.</p>
                  <p>I'm a 2nd-year BSIT student at Asia Pacific College, specializing in full-stack and mobile development.</p>
                </div>
                <div className="tags-container">
                  <span className="brutal-pill">Full-Stack Dev</span>
                  <span className="brutal-pill">Gamer</span>
                  <span className="brutal-pill">IT Student</span>
                </div>
              </div>
              <div className="about-image-wrapper interactive">
                <div className="profile-frame">
                  <img src={profileImg} alt="Jared Profile" className="profile-img" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education" className="content-section fade-in-up">
          <div className="brutal-container">
            <div className="section-tab"><span className="icon">▲</span> Education</div>
            <div className="education-monoliths">
              {EDUCATION.map((edu, index) => (
                <div key={edu.id} className="edu-block interactive" style={{ transform: `translateX(${index * 20}px)`, zIndex: 10 - index }}>
                  <div className="edu-logo-wrapper"><img src={edu.logo} alt="Logo" className="edu-logo-img" /></div>
                  <div className="edu-content">
                    <div className="edu-year">{edu.years}</div>
                    <div className="edu-details"><h3 className="edu-level">{edu.level}</h3><p className="edu-school">{edu.school}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="content-section fade-in-up">
          <div className="brutal-container">
            <div className="section-tab"><span className="icon">&lt;/&gt;</span> Skills</div>
            <div className="skills-grid">
              {SKILLS.map(skill => (
                <div key={skill.name} className="skill-card interactive">
                  <img src={skill.icon} alt={skill.name} className="skill-icon-img" />
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GAMES */}
        <section id="games" className="content-section fade-in-up">
          <div className="brutal-container">
            <div className="section-tab"><span className="icon">🎮</span> Favorites</div>
            <div className="games-grid">
              {GAMES.map(game => (
                <div key={game.id} className="game-card interactive">
                  <div className="game-img-wrapper"><img src={game.image} alt={game.title} className="game-img" /></div>
                  <div className="game-info">
                    <span className="game-genre">{game.genre}</span>
                    <h4 className="game-title">{game.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="content-section fade-in-up">
          <div className="brutal-container projects-container">
            <div className="section-tab"><span className="icon">[ ]</span> Projects</div>
            {PROJECTS.map(project => (
              <div key={project.id} className={`project-card ${project.reverse ? 'reverse' : ''}`}>
                <div className="project-image interactive"><img src={project.image} alt={project.title} className="project-img-preview" /></div>
                <div className="project-details">
                  <h3>{project.title}</h3>
                  <p className="project-desc">{project.desc}</p>
                  <div className="project-tech">
                    {project.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SOCIALS */}
        <section id="socials" className="content-section fade-in-up">
          <div className="brutal-container">
            <div className="section-tab"><span className="icon">🔗</span> Socials</div>
            <div className="socials-grid">
              {SOCIALS.map(social => (
                <a key={social.id} href={social.link} target="_blank" rel="noreferrer" className="social-card interactive">
                  <span className="social-arrow">↗</span>
                  <img src={social.image} alt={social.platform} className="social-icon-img" />
                  <span className="social-name">{social.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* GUESTBOOK (UPDATED WITH SUPABASE LOGIC) */}
        <section id="guestbook" className="content-section fade-in-up">
          <div className="brutal-container guestbook-container">
            <div className="section-tab"><span className="icon">✎</span> Guestbook</div>
            <div className="guestbook-grid">
              <div className="guestbook-form-area">
                <h2>Leave a Mark</h2>
                <p className="subtitle">Sign my digital guestbook. Connected via Supabase.</p>
                <form onSubmit={handleSubmit} className="brutal-form">
                  <input 
                    type="text" 
                    className="brutal-input interactive" 
                    placeholder="How should we call you?" 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    required 
                  />
                  <textarea 
                    className="brutal-input interactive" 
                    placeholder="Write your message here..." 
                    value={form.message} 
                    onChange={e => setForm({ ...form, message: e.target.value })} 
                    required 
                    rows={4} 
                  />
                  <button type="submit" disabled={loading} className="brutal-btn-large interactive">
                    {loading ? 'SIGNING...' : 'SIGN GUESTBOOK'}
                  </button>
                </form>
              </div>
              <div className="guestbook-feed-area">
                <div className="feed-header">
                  <h3>Recent Signatures</h3>
                  <span className="count-badge">{entries.length}</span>
                </div>
                <div className="entries-list">
                  {entries.length === 0 ? (
                    <div className="empty-state">No messages yet. Be the first!</div>
                  ) : (
                    entries.map(entry => (
                      <div key={entry.id} className="entry-card">
                        <div className="entry-meta">
                          <span className="entry-author">{entry.name}</span>
                          <span className="entry-date">
                            {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Just now'}
                          </span>
                        </div>
                        <p className="entry-msg">{entry.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built with intent by Jared Gatchalian © 2026</p>
      </footer>
    </div>
  );
}

export default App;