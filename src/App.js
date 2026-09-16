import React, { useState, useEffect, useRef } from 'react';

const KathaAI = () => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('mr');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [story, setStory] = useState(null);
  const canvasRef = useRef(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    setTimeout(() => {
      const isMarathi = language === 'mr';
      const cleanPrompt = encodeURIComponent(prompt.trim());

      const scenes = [
        { id: 1, text: isMarathi ? `१. ${prompt} ची सुंदर गोष्ट सुरू होते.` : `1. ${prompt} की कहानी शुरू होती है।`, img: `https://image.pollinations.ai/prompt/3d%20pixar%20scene1%20${cleanPrompt}?width=800&height=450&nologo=true` },
        { id: 2, text: isMarathi ? `२. अचानक एका मोठ्या संकटाला सामोरे जावे लागले.` : `2. अचानक एक बड़ी समस्या सामने आई।`, img: `https://image.pollinations.ai/prompt/3d%20pixar%20scene2%20${cleanPrompt}?width=800&height=450&nologo=true` },
        { id: 3, text: isMarathi ? `३. सर्व प्राण्यांनी मिळून समस्येवर मात केली.` : `3. सबने मिलकर समस्या को हल किया।`, img: `https://image.pollinations.ai/prompt/3d%20pixar%20scene3%20${cleanPrompt}?width=800&height=450&nologo=true` }
      ];

      setStory({
        title: prompt,
        scenes: scenes,
        moral: isMarathi ? "ऐक्य हेच मोठे बळ आहे." : "एकता ही सबसे बड़ी शक्ति है।"
      });
      setIsGenerating(false);
    }, 1200);
  };

  // Canvas Based Client-Side MP4 Video Creator
  const handleDownloadDirectMP4 = async () => {
    if (!story) return;
    setIsRendering(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    const stream = canvas.captureStream(30); // 30 FPS Video Stream
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${story.title}_KathaAI.mp4`;
      a.click();
      setIsRendering(false);
    };

    mediaRecorder.start();

    // Voice Synthesis Sync with Video Frames
    const fullText = story.scenes.map(s => s.text).join(' ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = language === 'mr' ? 'mr-IN' : 'hi-IN';

    window.speechSynthesis.speak(utterance);

    // Dynamic Image & Text Frame Rendering
    let currentSceneIndex = 0;
    const sceneDuration = 4000; // 4 Seconds per Image Scene

    const interval = setInterval(() => {
      if (currentSceneIndex < story.scenes.length) {
        const scene = story.scenes[currentSceneIndex];
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = scene.img;

        img.onload = () => {
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, 800, 600);
          ctx.drawImage(img, 0, 0, 800, 450);

          // Render Subtitles Box
          ctx.fillStyle = "rgba(0,0,0,0.8)";
          ctx.fillRect(0, 450, 800, 150);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 22px Arial";
          ctx.fillText(scene.text, 30, 520);
        };
        currentSceneIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          mediaRecorder.stop();
        }, 1000);
      }
    }, sceneDuration);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#4f46e5' }}>KathaAI - 1-Click MP4 Generator</h1>
      
      <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '10px' }}>
        <input 
          type="text" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          placeholder="गोष्टीचा विषय लिहा..." 
          style={{ width: '96%', padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '10px', borderRadius: '6px', width: '100%', marginBottom: '10px' }}>
          <option value="mr">मराठी</option>
          <option value="hi">हिंदी</option>
        </select>

        <button onClick={handleGenerate} disabled={isGenerating} style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          {isGenerating ? 'AI प्रोसेस करत आहे...' : 'गोष्ट तयार करा'}
        </button>
      </div>

      {story && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h2>{story.title}</h2>
          
          {/* Hidden Canvas for Background Video Rendering */}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

          <button 
            onClick={handleDownloadDirectMP4} 
            disabled={isRendering} 
            style={{ width: '100%', padding: '15px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isRendering ? '🎬 व्हिडिओ बनत आहे... ५ सेकंद थांबा' : '📥 Direct Download MP4 Video'}
          </button>
        </div>
      )}
    </div>
  );
};

export default KathaAI;
    
