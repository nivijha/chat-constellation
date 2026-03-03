import { useMemo, useCallback } from "react";
import { useChat } from "./MyContext.jsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./ConstellationGraph.css";

// Generate thousands of tiny stars using a single div and extensive box-shadows for pure CSS performance
function StarBackground() {
  const starsStyle = useMemo(() => {
    let shadows = "";
    const numStars = 1500; // Medium-distance pan-able stars
    for (let i = 0; i < numStars; i++) {
        const x = Math.floor(Math.random() * 6000) - 3000;
        const y = Math.floor(Math.random() * 6000) - 3000;
        const r = Math.random();
        let color = "rgba(255, 255, 255, 0.6)";
        if (r > 0.9) color = "rgba(165, 180, 252, 0.8)";
        else if (r > 0.8) color = "rgba(252, 211, 77, 0.7)";

        const size = Math.random() > 0.8 ? 1.2 : 0.8;
        shadows += `${x}px ${y}px ${size}px ${color}${i === numStars - 1 ? "" : ", "}`;
    }
    return { 
      boxShadow: shadows, width: 1, height: 1, borderRadius: '50%', background: 'transparent',
      position: 'absolute', top: '50%', left: '50%'
    };
  }, []);

  return <div style={starsStyle} />;
}

// A completely stationary layer of tiny, distant stars
function DeepStarBackground() {
  const starsStyle = useMemo(() => {
    let shadows = "";
    const numStars = 2500; // Deep background
    for (let i = 0; i < numStars; i++) {
        // Spread evenly across a standard viewport size (will be centered)
        const x = Math.floor(Math.random() * 3000) - 1500;
        const y = Math.floor(Math.random() * 2000) - 1000;
        const opacity = Math.random() * 0.5 + 0.1; // Very dim
        const color = `rgba(255, 255, 255, ${opacity})`;
        
        // Very small points (0.5 to 1px)
        const size = Math.random() > 0.9 ? 1 : 0.5;
        shadows += `${x}px ${y}px 0px ${size}px ${color}${i === numStars - 1 ? "" : ", "}`;
    }
    return { 
      boxShadow: shadows, width: 0, height: 0, 
      background: 'transparent', position: 'absolute', top: '50%', left: '50%', zIndex: 0 
    };
  }, []);

  return <div style={starsStyle} />;
}

// A single 2D star component representing a chat thread
function ThreadStar({ thread, position, onClick }) {
  return (
    <div 
      className="global-star-2d" 
      onClick={(e) => { e.stopPropagation(); onClick(thread.threadID); }}
      style={{
        position: 'absolute',
        left: `calc(50% + ${position.x}px)`,
        top: `calc(50% + ${position.y}px)`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="galaxy-star-core-2d" />
      <div className="galaxy-star-glow-2d" />
      
      <div className="galaxy-star-text-2d">
        <strong>{thread.title || "Untitled Chat"}</strong>
      </div>
    </div>
  );
}

export default function GlobalConstellation() {
  const { allThreads, changeThread } = useChat();

  // Generate 2D Fibonacci/Phyllotaxis spiral positions for perfect, clean uniformity
  const starData = useMemo(() => {
    const data = [];
    const goldenAngle = 137.5 * (Math.PI / 180); // 137.5 deg is the golden angle for natural phyllotaxis
    const spread = 80; // Distance modifier between stars
    
    // Spread them out in 2D space cleanly
    allThreads.forEach((thread, i) => {
      // Start index at 1 to prevent overlapping the dead center
      const index = i + 1; 
      const radius = spread * Math.sqrt(index);
      const angle = index * goldenAngle;
      
      const x = Math.cos(angle) * radius;
      // Add a slight elliptical squish to make it look like a galaxy disc from a subtle tilt
      const y = Math.sin(angle) * radius * 0.75;

      data.push({
        thread,
        position: { x, y }
      });
    });
    return data;
  }, [allThreads]);

  if (allThreads.length === 0) {
    return (
      <div className="constellation-wrapper">
        <div className="empty-state" style={{ opacity: 1, position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
          <div className="empty-star">✨</div>
          <h1 className="empty-title">The galaxy is empty</h1>
          <p className="empty-sub">Start a chat to create your first star.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="constellation-wrapper" style={{ background: 'radial-gradient(ellipse at bottom, #0a0a0c 0%, #000000 100%)' }}>
      {/* The stationary deep space background of tiny stars */}
      <DeepStarBackground />

      <TransformWrapper
        initialScale={0.8}
        minScale={0.1}
        maxScale={6}
        centerOnInit={true}
        limitToBounds={false}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: false, step: 1.5, animationTime: 400 }}
        panning={{ disabled: false, velocityDisabled: false }}
      >
        {({ zoomIn, zoomOut, zoomToElement }) => (
          <>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
              {/* Infinite 2D space where stars render relative to the screen center */}
              <div style={{ width: "100%", height: "100%", position: 'relative' }}>
                <StarBackground />
                
                {/* Render each thread as a Major Star */}
                {starData.map((data) => (
                  <ThreadStar 
                    key={data.thread.threadID} 
                    thread={data.thread} 
                    position={data.position}
                    onClick={(e, threadId) => {
                      // 1. Zoom the camera directly onto the clicked star element
                      zoomToElement(e.currentTarget, 4, 800, "easeOutCubic");
                      
                      // 2. Wait for the zoom animation to finish before transitioning views
                      setTimeout(() => {
                        changeThread(threadId, "constellation");
                      }, 800);
                    }}
                  />
                ))}
              </div>
            </TransformComponent>

            {/* Minimalist Glass UI Zoom Controls */}
            <div className="zoom-controls">
              <button 
                onClick={() => zoomIn(0.5)} 
                title="Zoom In"
                aria-label="Zoom In"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              </button>
              <button 
                onClick={() => zoomOut(0.5)} 
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              </button>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
