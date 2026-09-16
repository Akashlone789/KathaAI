import React, { useState, useEffect, useRef } from 'react';

const KathaAI = () => {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Panchatantra');
  const [language, setLanguage] = useState('mr');
  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);

  const cardRef = useRef(null);

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
      const videoImageUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/450`;
      
      setStory({
        title: prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt,
        text: `एकदा एका सुंदर जंगलात, ${prompt} विषयीची ही गोष्ट घडली. जंगलातील सर्व प्राणी एकत्र आले आणि त्यांनी एका मोठ्या समस्येवर उपाय शोधण्याचे ठरवले. या गोष्टीवरून आपल्याला शिकायला मिळते की संकटाच्या वेळी सर्वांनी एकत्र येऊन काम केले पाहिजे.`,
        moral: "ऐक्य हेच मोठे बळ आहे.",
        videoUrl: videoImageUrl
      });
      setIsGenerating(false);
    }, 1500);
  };

  const handlePlayVideoStory = () => {
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

  // Story Image Card Downloader Logic
  const handleDownloadCard = () => {
    if (!story) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = story.videoUrl;

    img.onload = () => {
      // Card Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 800, 800);

      // Story Scene Image
      ctx.drawImage(img, 0, 0, 800, 450);

      // Overlay Gradient
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, 370, 800, 80);

      // Title Text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px Arial";
      ctx.fillText(story.title, 30, 420);

      // Story Text Content
      ctx.fillStyle = "#1f2937";
      ctx.font = "20px Arial";
      
      const words = story.text.split(' ');
      let line = '';
      let y = 500;

      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > 740 && n > 0) {
          ctx.fillText(line, 30, y);
          line = words[n] + ' ';
          y += 35;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 30, y);

      // Moral Banner
      ctx.fillStyle = "#eef2ff";
      ctx.fillRect(30, 700, 740, 60);
      ctx.fillStyle = "#4f46e5";
      ctx.font = "bold 20px Arial";
      ctx.fillText("तात्पर्य: " + story.moral, 50, 738);

      // Trigger Download
      const link = document.createElement('a');
      link.download = `${story.title}_StoryCard.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#4f46e5' }}>KathaAI (कथा AI Video App)</h1>
        <p style={{ color: '#6b7280' }}>AI च्या साहाय्याने तयार करा सुंदर कथा आणि व्हिडिओ!</p>
      </header>

      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>गोष्टीचा विषय लिहा:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="उदा. एका हुशार कावळ्याची गोष्ट..."
            style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
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
        <div ref={cardRef} style={{ marginTop: '30px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2>{story.title}</h2>
          
          <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', marginBottom: '15px', backgroundColor: '#000' }}>
            <img 
              src={story.videoUrl} 
              alt="Story Scene" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{story.text}</p>
          
          <div style={{ backgroundColor: '#eef2ff', padding: '10px', borderRadius: '8px', marginTop: '15px' }}>
            <strong>तात्पर्य:</strong> {story.moral}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button onClick={handlePlayVideoStory} style={{ flex: 1, padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {isPlaying ? 'थांबवा' : '🎬 Play Video (Screen Record)'}
            </button>

            <button onClick={handleDownloadCard} style={{ flex: 1, padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              🖼️ Download Story Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KathaAI;
