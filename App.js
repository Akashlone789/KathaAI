import React, { useState, useEffect } from 'react';
import { Play, Pause, Wand2, Sparkles } from 'lucide-react';

const KathaAI = () => {
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
      setStory({
        title: prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt,
        text: `एकदा एका सुंदर जंगलात, ${prompt} विषयीची ही गोष्ट घडली. जंगलातील सर्व प्राणी एकत्र आले आणि त्यांनी एका मोठ्या समस्येवर उपाय शोधण्याचे ठरवले. या गोष्टीवरून आपल्याला शिकायला मिळते की संकटाच्या वेळी सर्वांनी एकत्र येऊन काम केले पाहिजे.`,
        moral: "ऐक्य हेच मोठे बळ आहे."
      });
      setIsGenerating(false);
    }, 1500);
  };

  const handleSpeak = () => {
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

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Sparkles /> KathaAI (कथा AI)
        </h1>
        <p style={{ color: '#6b7280' }}>AI च्या साहाय्याने तयार करा सुंदर गोष्टी आणि ऑडिओ!</p>
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
        <div style={{ marginTop: '30px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2>{story.title}</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{story.text}</p>
          <div style={{ backgroundColor: '#eef2ff', padding: '10px', borderRadius: '8px', marginTop: '15px' }}>
            <strong>तात्पर्य:</strong> {story.moral}
          </div>
          <button onClick={handleSpeak} style={{ marginTop: '15px', padding: '10px 15px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            {isPlaying ? 'थांबवा' : 'गोष्ट ऐका (Audio)'}
          </button>
        </div>
      )}
    </div>
  );
};

export default KathaAI;
  
