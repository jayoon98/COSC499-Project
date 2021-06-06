export default function Welcome() {
  return (
    <>
      <div className="welcome">
        <p className="welcome-header">Welcome</p>
        <div className="welcome-box">
          <p className="welcome-aboutus">About Us</p>
          <p className="welcome-text">
            The aim of this site is to help improve your well-being whilst encouraging you to
            learn more about your own health. You can begin by completing the short questionnaire
            below, which will allow us to begin to determine your current mental health state. Then,
            you will be presented with helpful perspectives based on your answers, such
            as graphs, charts, and concentric circles. These perspectives give you a better
            understanding of how your health domains interact and influence one another, as well as
            how you can improve certain domains. The five health domains are:
            <b> Physical, Mental, Emotional, Spiritual, and Social.</b>
          </p>
        </div>
        <svg className="cirlces" width="794" height="794" viewBox="0 0 794 794">
          <defs>
            <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#7ec7ff" />
              <stop offset="1" stopColor="#41adff" />
            </linearGradient>
            <filter id="blue" x="0" y="0" width="794" height="794" filterUnits="userSpaceOnUse">
              <feOffset dy="3" />
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodOpacity="0.161" />
              <feComposite operator="in" in2="blur" />
              <feComposite in="SourceGraphic" />
            </filter>
            <linearGradient id="linear-gradient-2" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#9beaff" />
              <stop offset="0.289" stopColor="#64ddfd" />
              <stop offset="0.464" stopColor="#42d5fc" />
              <stop offset="1" stopColor="#38d0f8" />
            </linearGradient>
            <filter id="Ellipse_65" x="78" y="78" width="639" height="639" filterUnits="userSpaceOnUse">
              <feOffset dy="3" />
              <feGaussianBlur stdDeviation="3" result="blur-2" />
              <feFlood floodOpacity="0.161" />
              <feComposite operator="in" in2="blur-2" />
              <feComposite in="SourceGraphic" />
            </filter>
            <filter id="white_circle" x="140" y="142" width="515" height="515" filterUnits="userSpaceOnUse">
              <feOffset dy="5" />
              <feGaussianBlur stdDeviation="3" result="blur-3" />
              <feFlood floodOpacity="0.161" />
              <feComposite operator="in" in2="blur-3" />
              <feComposite in="SourceGraphic" />
            </filter>
          </defs>
          <g id="monochrome_blues" data-name="monochrome blues" transform="translate(-563 -102)">
            <g transform="matrix(1, 0, 0, 1, 563, 102)" filter="url(#blue)">
              <circle id="blue-2" data-name="blue" cx="388" cy="388" r="388" transform="translate(9 6)" fill="url(#linear-gradient)" />
            </g>
            <g transform="matrix(1, 0, 0, 1, 563, 102)" filter="url(#Ellipse_65)">
              <circle id="Ellipse_65-2" data-name="Ellipse 65" cx="310.5" cy="310.5" r="310.5" transform="translate(87 84)" fill="url(#linear-gradient-2)" />
            </g>
            <g transform="matrix(1, 0, 0, 1, 563, 102)" filter="url(#white_circle)">
              <circle id="white_circle-2" data-name="white circle" cx="248.5" cy="248.5" r="248.5" transform="translate(149 146)" fill="#fff" />
            </g>
          </g>
        </svg>
      </div>
    </>
  );
}
