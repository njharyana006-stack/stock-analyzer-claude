import React, { useRef, useEffect } from 'react';

interface RadarChartProps {
  scores: {
    technical_score: number;
    sentiment_score: number;
    risk_alignment_score: number;
  };
}

const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { technical_score, sentiment_score, risk_alignment_score } = scores;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 * 0.7;
    const sides = 3;
    const angle = (Math.PI * 2) / sides;

    const labels = ['Technical', 'Sentiment', 'Risk-Alignment'];
    const dataPoints = [technical_score, sentiment_score, risk_alignment_score];

    ctx.clearRect(0, 0, width, height);

    // Draw grid lines (spider web)
    ctx.strokeStyle = '#e2e8f0'; // slate-200
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      for (let j = 0; j < sides; j++) {
        const x = centerX + radius * (i / 5) * Math.cos(angle * j - Math.PI / 2);
        const y = centerY + radius * (i / 5) * Math.sin(angle * j - Math.PI / 2);
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axis lines
    ctx.strokeStyle = '#cbd5e1'; // slate-300
    for (let i = 0; i < sides; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      const x = centerX + radius * Math.cos(angle * i - Math.PI / 2);
      const y = centerY + radius * Math.sin(angle * i - Math.PI / 2);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw labels
    ctx.fillStyle = '#475569'; // slate-600
    ctx.font = 'bold 12px sans-serif';
    for (let i = 0; i < sides; i++) {
      const x = centerX + (radius * 1.15) * Math.cos(angle * i - Math.PI / 2);
      const y = centerY + (radius * 1.15) * Math.sin(angle * i - Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], x, y);
    }
    
    // Draw data polygon
    ctx.beginPath();
    dataPoints.forEach((score, i) => {
        const value = score / 10;
        const x = centerX + radius * value * Math.cos(angle * i - Math.PI / 2);
        const y = centerY + radius * value * Math.sin(angle * i - Math.PI / 2);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();

    ctx.strokeStyle = '#4f46e5'; // indigo-600
    ctx.fillStyle = 'rgba(79, 70, 229, 0.2)'; // indigo-600 with opacity
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();

    // Draw data points
    ctx.fillStyle = '#4f46e5'; // indigo-600
    dataPoints.forEach((score, i) => {
        const value = score / 10;
        const x = centerX + radius * value * Math.cos(angle * i - Math.PI / 2);
        const y = centerY + radius * value * Math.sin(angle * i - Math.PI / 2);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });


  }, [technical_score, sentiment_score, risk_alignment_score]);

  return (
    <div className="w-full max-w-[300px] aspect-square">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default RadarChart;
