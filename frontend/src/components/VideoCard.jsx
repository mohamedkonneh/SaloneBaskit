import React from 'react';

const VideoCard = ({ videoUrl, title, channel, stats }) => {
  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);
  // Construct the embed URL for autoplay, mute, loop, and no controls
  const embedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1`
    : null;

  if (!embedUrl) {
    // Fallback for invalid URLs
    return <div style={styles.card}>Invalid Video URL</div>;
  }

  return (
    <div style={styles.card}>
      <div style={styles.thumbnailContainer}>
        <iframe
          style={styles.videoFrame}
          src={embedUrl}
          title={title || 'YouTube video player'}
          frameBorder="0"
          allow="autoplay; encrypted-media;"
          allowFullScreen
        ></iframe>
        {/* This div sits on top of the iframe to prevent any clicks */}
        <div style={styles.clickInterceptor}></div>
      </div>
      {title && (
          <div style={styles.info}>
            <h4 style={styles.title}>{title}</h4>
            <p style={styles.channel}>{channel}</p>
            <p style={styles.stats}>{stats}</p>
          </div>
        )}
      </div>
  );
};

const styles = {
  card: {
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    animation: 'fadeIn 0.5s ease-in-out',
    display: 'flex', flexDirection: 'column', // Ensure it can grow
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9', // Enforce landscape format
    backgroundColor: '#000',
  },
  videoFrame: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  clickInterceptor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Make sure it's on top of the iframe
  },
  info: {
    padding: '12px',
    flexGrow: 1, // Allow info section to grow
  },
  title: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 4px 0',
  },
  channel: { fontSize: '0.85rem', color: '#606060', margin: '0 0 4px 0' },
  stats: { fontSize: '0.85rem', color: '#606060', margin: 0 },
};

export default VideoCard;

// Add keyframes for the animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(styleSheet);