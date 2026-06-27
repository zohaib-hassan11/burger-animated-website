'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/*
  The right-side scrolling text. Each chapter pairs with a scroll
  position that drives the burger animation on the left.
*/
const CHAPTERS = [
  {
    step: 'Hello',
    title: 'The real deal.',
    body:
      "No shortcuts. No fillers. Just an honest burger, made the way it should be — " +
      "with patience, with care, and with ingredients you can name. We have been " +
      "doing it the same way since the day we opened, and we are not about to change " +
      "now. Every order, every shift, every shop, every single bun.",
    body2:
      "Drag the burger to spin it around. Scroll down to read the story. Then come " +
      "see us — we will save you a stool at the counter.",
  },
  {
    step: 'The Beef',
    title: '100% grass-fed.',
    body:
      "Hand-pressed every single morning. Our beef comes from grass-fed cattle " +
      "raised on small family farms — never frozen, never reformed, never compromised. " +
      "We char-grill to order so the outside crisps and the inside stays juicy.",
    body2:
      "You can taste the difference in the first bite, and you will feel it in every " +
      "one after. No mystery meat. No sad steam-table patties. Just beef, fire, and " +
      "twenty seconds of perfect timing.",
  },
  {
    step: 'The Build',
    title: 'Layered with care.',
    body:
      "Aged cheddar that melts slow so it pools instead of running off the side. " +
      "Crisp lettuce picked the same morning we serve it — not the same week. " +
      "Heirloom tomato, sliced thick. House-pickled red onion for a sharp finish.",
    body2:
      "And a sesame brioche bun baked in our own kitchens at four in the morning — " +
      "golden, soft, and just strong enough to hold it all together right down to " +
      "the last bite.",
  },
  {
    step: 'The Promise',
    title: 'Fresh, every time.',
    body:
      "From the farm to your hands — under twenty-four hours. Every ingredient, " +
      "every time. We track it, we measure it, and we will not compromise on it. " +
      "If a delivery shows up looking off, we send it back. If a batch is not right, " +
      "we throw it out.",
    body2:
      "When you bite into our burger you are tasting yesterday's harvest, this " +
      "morning's grill, and the same recipe a family has trusted for decades. That " +
      "is the deal. We have not broken it yet.",
  },
  {
    step: 'Order',
    title: 'Made fresh. Served hot.',
    body:
      "Find your nearest location, walk in, sit down, and let us cook for you. Open " +
      "until late, seven nights a week. No app required, no waitlist, no nonsense — " +
      "just a burger that takes its time, made by people who care about it.",
    body2:
      "We have a stool with your name on it. Or pick it up to go — either way, we " +
      "will be ready when you get here.",
    cta: 'Find your nearest location →',
    ctaHref: '/locations',
  },
];

export default function Sections() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.section-content').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {CHAPTERS.map((c, i) => (
        <section key={i} className="section">
          <div className="section-content">
            <span className="step">{c.step}</span>
            <h2>{c.title}</h2>
            <p>{c.body}</p>
            {c.body2 && <p className="body-2">{c.body2}</p>}
            {c.cta && (
              <Link className="cta" href={c.ctaHref || '/locations'}>
                {c.cta}
              </Link>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
