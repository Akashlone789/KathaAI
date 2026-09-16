import React, { useState, useEffect } from 'react';

const KathaAI = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Panchatantra');
  const [language, setLanguage] = useState('mr');
  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSynth(window.speechSynthesis);
    }
  }, []);

  const genres = [
    { id: 'Panchatantra', name: 'पंचतंत्र (Panchatantra)' },
    { id: 'Moral', name: 'बोधकथा (Moral Stories)' },
    { id: 'FairyTail', name: 'परीकथा (Fairy Tales)' },
    { id: 'Mythology', name: 'पौराणिक कथा (Mythology)' }
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    setTimeout(() => {
      const isMarathi = language === 'mr';
      
      const storyText = isMarathi 
        ? `${prompt} विषयीची ही एक सुंदर बोधकथा आहे. एका सुंदर गावात सर्व लोक आनंदाने राहत होते. एके दिवशी तेथे एक मोठी समस्या निर्माण झाली. सर्वांनी एकत्र येऊन हुशारीने या समस्येवर मार्ग काढण्याचे ठरवले. प्रत्येकाने आपापले योगदान दिले आणि शेवटी सर्वांच्या मदतीने संकटाचे निवारण झाले.`
        : `${prompt} के बारे में यह एक प्रेरणादायक कहानी है। एक सुंदर गांव में सभी लोग खुशी-खुशी रहते थे। एक दिन वहां एक बड़ी समस्या खड़ी हो गई। सभी ने मिलकर समझदारी से इस समस्या का समाधान निकालने का फैसला किया।`;

      const moralText = isMarathi ? "ऐक्य हेच मोठे बळ आहे." : "एकता ही सबसे बड़ी शक्ति है।";

      setStory({
        title: prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt,
        text: storyText,
        moral: moralText,
        imageUrl: `https://image.pollinations.ai/prompt/3d%20pixar%20style%20illustration%20of%20${encodeURIComponent(prompt)}?width=800&height=450&nologo=true`
      });
      setIsGenerating(false);
    }, 1200);
  };

  const handlePlayAudio = () => {
    if (!speechSynth || !story) return;

    if (isPlaying) {
      speechSynth.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(story.text);
      utterance.lang = language === 'mr' ? 'mr-IN' : 'hi-IN';
      utterance.onend = () => setIsPlaying(false);
      speechSynth.speak(utterance);
      setIsPlaying(true);
    }
  };

  // Canvas Based Multi-Page Image Card Downloader
  const handleDownloadCard = () => {
    if (!story) return;

    const words = story.text.split(' ');
    const wordsPerPage = 50;
    const pagesCount = Math.ceil(words.length / wordsPerPage);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = story.imageUrl;

    img.onload = () => {
      for (let p = 0; p < pagesCount; p++) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 950;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, 800, 400);

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 330, 800, 70);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px Arial";
        ctx.fillText(`${story.title} (Page ${p + 1}/${pagesCount})`, 30, 375);

        const pageWords = words.slice(p * wordsPerPage, (p + 1) * wordsPerPage);
        let lines = [];
        let currentLine = '';

        ctx.font = "22px Arial";
        for (let i = 0; i < pageWords.length; i++) {
          let testLine = currentLine + pageWords[i] + ' ';
          let metrics = ctx.measureText(testLine);
          if (metrics.width > 720 && i > 0) {
            lines.push(currentLine);
            currentLine = pageWords[i] + ' ';
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);

        ctx.fillStyle = "#1f2937";
        let startY = 450;
        lines.forEach((lineText) => {
          ctx.fillText(lineText.trim(), 40, startY);
          startY += 38;
        });

        if (p === pagesCount - 1) {
          startY = Math.max(startY + 20, 820);
          ctx.fillStyle = "#eef2ff";
          ctx.fillRect(30, startY, 740, 70);
          ctx.fillStyle = "#4f46e5";
          ctx.font = "bold 22px Arial";
          const moralLabel = language === 'mr' ? 'तात्पर्य: ' : 'सीख: ';
          ctx.fillText(moralLabel + story.moral, 50, startY + 42);
        }

        const link = document.createElement('a');
        link.download = `${story.title}_Page_${p + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* Header Navigation */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <h2 style={{ color: '#4f46e5', margin: 0, cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>KathaAI</h2>
        <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
          <button onClick={() => setCurrentPage('home')} style={{ background: 'none', border: 'none', color: currentPage === 'home' ? '#4f46e5' : '#374151', fontWeight: 'bold', cursor: 'pointer' }}>Home</button>
          <button onClick={() => setCurrentPage('about')} style={{ background: 'none', border: 'none', color: currentPage === 'about' ? '#4f46e5' : '#374151', fontWeight: 'bold', cursor: 'pointer' }}>About Us</button>
          <button onClick={() => setCurrentPage('privacy')} style={{ background: 'none', border: 'none', color: currentPage === 'privacy' ? '#4f46e5' : '#374151', fontWeight: 'bold', cursor: 'pointer' }}>Privacy Policy</button>
          <button onClick={() => setCurrentPage('terms')} style={{ background: 'none', border: 'none', color: currentPage === 'terms' ? '#4f46e5' : '#374151', fontWeight: 'bold', cursor: 'pointer' }}>Terms</button>
          <button onClick={() => setCurrentPage('contact')} style={{ background: 'none', border: 'none', color: currentPage === 'contact' ? '#4f46e5' : '#374151', fontWeight: 'bold', cursor: 'pointer' }}>Contact</button>
        </div>
      </nav>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <>
            <header style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
              <h1 style={{ color: '#4f46e5' }}>KathaAI - AI स्टोरी जनरेटर</h1>
              <p style={{ color: '#6b7280' }}>मराठी आणि हिंदी भाषांमध्ये AI च्या साहाय्याने कथा आणि चित्रे तयार करा!</p>
            </header>

            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>गोष्टीचा विषय लिहा:</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="उदा. एका हुशार कावळ्याची गोष्ट..."
                  style={{ width: '97%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>प्रकार:</label>
                  <select value={genre} onChange={(e) => setGenre(e.target.value)} style={{ padding: '8px', borderRadius: '6px' }}>
                    {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>भाषा:</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '8px', borderRadius: '6px' }}>
                    <option value="mr">मराठी</option>
                    <option value="hi">हिंदी</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {isGenerating ? 'गोष्ट तयार होत आहे...' : 'गोष्ट तयार करा'}
              </button>
            </div>

            {story && (
              <div style={{ marginTop: '30px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h2>{story.title}</h2>
                <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', marginBottom: '15px' }}>
                  <img src={story.imageUrl} alt="Story Scene" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{story.text}</p>
                <div style={{ backgroundColor: '#eef2ff', padding: '12px', borderRadius: '8px', marginTop: '15px' }}>
                  <strong>{language === 'mr' ? 'तात्पर्य:' : 'सीख:'}</strong> {story.moral}
                </div>

                {/* ACTION BUTTONS (PLAY AUDIO & DOWNLOAD CARD) */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button onClick={handlePlayAudio} style={{ flex: 1, padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {isPlaying ? 'थांबवा' : '🎬 Play Audio'}
                  </button>

                  <button onClick={handleDownloadCard} style={{ flex: 1, padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🖼️ Download Story Card
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ABOUT US PAGE */}
        {currentPage === 'about' && (
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '20px' }}>
            <h2>About KathaAI</h2>
            <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
              Welcome to <strong>KathaAI</strong>, your ultimate platform for generating unique Marathi and Hindi stories using Artificial Intelligence.
            </p>
          </div>
        )}

        {/* PRIVACY POLICY PAGE */}
        {currentPage === 'privacy' && (
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '20px' }}>
            <h2>Privacy Policy</h2>
            <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
              At KathaAI, accessible from our web platform, one of our main priorities is the privacy of our visitors.
            </p>
          </div>
        )}

        {/* TERMS PAGE */}
        {currentPage === 'terms' && (
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '20px' }}>
            <h2>Terms and Conditions</h2>
            <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
              By accessing KathaAI, you agree to generate respectful and educational content.
            </p>
          </div>
        )}

        {/* CONTACT PAGE */}
        {currentPage === 'contact' && (
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '20px' }}>
            <h2>Contact Us</h2>
            <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
              If you have any questions, feedback, or suggestions:
            </p>
            <p style={{ fontWeight: 'bold', color: '#4f46e5' }}>Email: support@kathaai.com</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default KathaAI;
  
