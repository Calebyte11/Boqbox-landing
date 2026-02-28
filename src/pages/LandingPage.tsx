import React from 'react';
import Nav from '../components/Nav';

interface LandingPageProps {
  onStart: () => void;
  onGetMe: () => void;
}

export default function LandingPage({ onStart, onGetMe }: LandingPageProps) {
  const WHATSAPP_LINK = "https://wa.me/+2347065813394";
  return (
    <div className="app-frame page-enter">
      <Nav />
      <div className="landing-page">
        <div className="landing-hero">
              <h1 className="landing-title">
                <span className="orange"><span className="block-quote-mark">“</span>Subscribe Quietly.</span>
                <span className="black"> Delivered Quietly.</span>
                <span className="black">No Drama.<span className="block-quote-mark">”</span></span>
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

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-chat-head"
          aria-label="Chat with us on WhatsApp"
        >
          <span className="whatsapp-chat-head__label">Need help? Chat with us</span>
          <span className="whatsapp-chat-head__bubble">
            <svg viewBox="0 0 24 24" className="whatsapp-chat-head__icon" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
