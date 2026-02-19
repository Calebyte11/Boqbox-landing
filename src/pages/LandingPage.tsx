import React from 'react';
import Nav from '../components/Nav';

interface LandingPageProps {
  onStart: () => void;
  onGetMe: () => void;
}

export default function LandingPage({ onStart, onGetMe }: LandingPageProps) {
  return (
    <div className="app-frame page-enter">
      <Nav />
      <div className="landing-page">
        <div className="landing-hero">
          <h1 className="landing-title">
            <span className="orange">Send love,</span>
            <span className="black">not links.</span>
          </h1>
          <p className="landing-subtitle">
            Pick what you need. Pick A vendor. Done.<br />
            No sign-in. No browsing. Just certainty.
          </p>
          <div className="landing-cta-container">
            <button className="landing-cta" onClick={onStart}>
              Send A gift
            </button>
            <button className="landing-cta-get landing-cta-secondary" onClick={onGetMe}>
              Get Me
            </button>
            <p className="landing-subtitle-get">pads, condoms... discrete delivery - plain bag, no label</p>
          </div>
        </div>

        <div className="landing-image-wrap">
          <img src={require('../assets/images/preview.png')} alt="Gift preview" className="landing-preview-image" />
        </div>
      </div>
    </div>
  );
}
