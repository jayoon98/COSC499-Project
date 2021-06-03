import React from 'react';

export default function DomainCircle({ props }) {
  const { color, score, title } = props;
  const scaledScore = (((score ?? 5) - 1) / 9) * 5 + 5;
  const myStyle = {
    width: '100%',
    borderRadius: '100%',
    borderColor: `#${color}`,
    height: '100%',
    position: 'absolute' as 'absolute',
    top: '0',
    left: '0',
  };
  return (
    <>
      <p style={{ fontSize: '2vw', textAlign: 'center', color: `#${color}` }}>
        {title}
      </p>
      <div style={{ paddingTop: `${(100 - 100 * (scaledScore / 10)) / 2}%` }}>
        <div style={{
          margin: 'auto', width: `${100 * (scaledScore / 10)}%`, paddingTop: `${100 * (scaledScore / 10)}%`, position: 'relative',
        }}
        >
          <div className="domain-circles" style={myStyle} />
          <div style={{
            fontSize: '3vw', color: `#${color}`, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
          }}
          >
            {score ?? '...' }
          </div>
        </div>
      </div>
    </>
  );
}
