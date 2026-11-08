import { useState, useRef, useEffect } from 'react'
import './index.css'
import './App.css'
import Primer1 from '../Primer1.jsx'
import { availableLanguages, translations } from '../translations.js'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const returnScrollThreshold = 1600
const statMetrics = [
  { target: 86, suffix: '+' },
  { target: 40, suffix: '+' },
  { target: 90, suffix: '%' },
  { target: 7, suffix: '+' },
]


export default function App() {
  const containerRef = useRef(null)
  // One language state controls this page and the auth demo opened from it.
  const [language, setLanguage] = useState('ru')
  const [openId, setOpenId] = useState(null)
  const [isAuthDemoOpen, setIsAuthDemoOpen] = useState(false)
const [isFlipped, setIsFlipped] = useState(false) // Керує переворотом картки

  const [isFinalScroll, setIsFinalScroll] = useState(false)
  const [upScrollProgress, setUpScrollProgress] = useState(0)
  const upScrollDistanceRef = useRef(0)
  const returningHomeRef = useRef(false)
const gridRef = useRef(null)
const stackRef = useRef(null)
  const t = translations[language]

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const scale = useTransform(smoothScroll, [0, 0.6], [1, 8])

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (returningHomeRef.current) {
        if (latest <= 0.1) {
          returningHomeRef.current = false
        }
        return
      }

      if (!isFinalScroll && latest >= 0.6) {
        setIsFinalScroll(true)
      } else if (isFinalScroll && latest <= 0.1) {
        setIsFinalScroll(false)
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress, isFinalScroll])


   useEffect(() => {
          
            if(isFinalScroll && gridRef.current) {
              const el = gridRef.current;
            gsap.fromTo(el.querySelectorAll('.stat-card'),
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'easeOut', stagger: 0.2 }
            )
            el.querySelectorAll('.stat-card').forEach((item) => {
              const NumEl = item.querySelector('.stat-number');
              const target = parseInt(NumEl.getAttribute('data-target'), 10);
              const suffix = NumEl.getAttribute('data-suffix') || '';

              const countObj = { val: 0 };
                gsap.to(countObj, {
                  val: target,
                  duration: 1.8,
                  ease: "power2.out",
                  delay: 0.2,
                  onUpdate: () => {
              if (NumEl) {NumEl.innerText = `${Math.floor(countObj.val)}${suffix}`;}
                  },
                  onComplete: () => {
                    if (NumEl) { NumEl.innerText = `${target}${suffix}`; }
                  },
                });
            });
          }
        }, [isFinalScroll]);


        const handleFinalScreenWheel = (event) => {
          if (event.deltaY >= 0) {
            upScrollDistanceRef.current = 0
            setUpScrollProgress(0)
            return
          }

          const deltaMultiplier = event.deltaMode === 1
            ? 40
            : event.deltaMode === 2
              ? window.innerHeight
              : 1
          const nextDistance = Math.min(
            upScrollDistanceRef.current + Math.abs(event.deltaY * deltaMultiplier),
            returnScrollThreshold
          )

          upScrollDistanceRef.current = nextDistance
          setUpScrollProgress(nextDistance / returnScrollThreshold)

          if (nextDistance >= returnScrollThreshold) {
            event.preventDefault()
            returningHomeRef.current = true
            upScrollDistanceRef.current = 0
            setUpScrollProgress(0)
            setIsFinalScroll(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }







  return (
    <>

<div className="vignette" style={{ pointerEvents: 'none' }}>
        <div
          ref={containerRef}
          className="container"
          style={{ height: '500vh', background: isFinalScroll ? '#FFE954' : '#000000', position: 'relative',transition: 'background-color 0.5s ease'  }}
        >
          <select
            className="language-control"
            aria-label={t.languageLabel}
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {availableLanguages.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>


            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="hero-heading"
            >
              fanakovich - <span className="text1-2">{t.heroRole}</span>
            </motion.h1>


            <motion.div
            initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="hero-description"
            >
              {t.heroDescription}
            </motion.div>



      {!isFinalScroll ? (
        
          <div
            style={{
              position: 'sticky',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              overflow: 'hidden',
            }}
          >
            <motion.img
              initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ scale, originX: '83%', originY: '43%',
                width: '100vw', 
                height: '100vh', 
                objectFit: 'cover'  }}
              src="/bear.png"
              alt="hero"
              className="hero"/>

            <motion.p className="pls-scroll">
              {t.scrollDown} ↓
            </motion.p>

           
          </div>
        
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="final-screen"
          onWheel={handleFinalScreenWheel}
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            height: '100vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            color: '#111',
            textAlign: 'center',
            boxSizing: 'border-box',
            zIndex: 10000,
          }}
        >
          <div
            className="return-progress"
            role="progressbar"
            aria-label="Прогресс возврата на главный экран"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(upScrollProgress * 100)}
          >
            <div
              className="return-progress-fill"
              style={{ transform: `scaleX(${upScrollProgress})` }}
            />
          </div>
          <div ref={gridRef} className="stats-grid">
            {t.stats.map((description, index) => (
              <div className="stat-card" key={description}>
                <div
                  className="stat-number"
                  data-target={statMetrics[index].target}
                  data-suffix={statMetrics[index].suffix}
                >
                  {statMetrics[index].target}{statMetrics[index].suffix}
                </div>
                <p className="stat-text">{description}</p>
              </div>
            ))}
          </div>

<div className="faq-container">
  <h2 className="faq-main-title">{t.faqTitle}</h2>
  <p className="faq-subtitle">{t.faqSubtitle}</p>

  <button
    className="auth-demo-launch"
    type="button"
    onClick={() => setIsAuthDemoOpen(true)}
  >
    <span className="auth-demo-launch-mark" aria-hidden="true">01</span>
    <span className="auth-demo-launch-copy">
      <strong>{t.authExampleTitle}</strong>
      <small>{t.authExampleAction}</small>
    </span>
    <span className="auth-demo-launch-arrow" aria-hidden="true">↗</span>
  </button>

  {t.questions.map((item, index) => {
    const questionId = index + 1
    const isOpen = openId === questionId

    return (
      <div
        className={`faq-item ${isOpen ? 'active' : ''}`}
        key={item.question}
        onClick={() => setOpenId(isOpen ? null : questionId)}
      >
        <div className="faq-trigger">
          <p className="faq-question">{item.question}</p>
          <span className="faq-icon">+</span>
        </div>
        {isOpen && <div className="faq-answer">{item.answer}</div>}
      </div>
    )
  })}

<div className="flip-card-wrapper" onClick={() => setIsFlipped(!isFlipped)}>
  <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
    
    {/* ЛИЦЬОВА СТОРОНА */}
    <div className="flip-card-front">
      <h2 style={{ fontSize: '2.5rem', fontFamily: 'serif', fontWeight: 'bold', margin: 0 }}>
        {t.flipTitle}
      </h2>
      <p style={{ fontSize: '1rem', color: '#555', marginTop: '15px', fontFamily: 'sans-serif' }}>
        {t.flipPrompt}
      </p>
    </div>

    {/* ЗВОРОТНА СТОРОНА (СПИСОК НАВИЧОК) */}
    <div className="flip-card-back">
      <p className="flip-card-back-kicker">{t.servicesKicker}</p>
      <h3 className="flip-card-back-title">{t.servicesTitle}</h3>
      <ul className="flip-card-back-list">
        {t.services.map((service) => (
          <li key={service.title}><b>{service.title}</b><span>{service.description}</span></li>
        ))}
      </ul>
    </div>

  </div>
</div>

<footer className="contact-footer">
  <span>{t.contactLabel}</span>
  <a href="https://t.me/backnoise" target="_blank" rel="noreferrer">@backnoise</a>
</footer>

{isAuthDemoOpen && <Primer1 language={language} onClose={() => setIsAuthDemoOpen(false)} />}

</div>


        </motion.div>
      )}
    </div>
  </div>
</>
  )
}
