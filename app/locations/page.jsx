'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LOCATIONS = [
  { city: 'New York',     neighborhood: 'Lower East Side',  address: '142 Bowery, NYC',                  hours: 'Mon–Sun · 11am – 1am' },
  { city: 'San Francisco',neighborhood: 'Mission District', address: '885 Valencia St, SF',              hours: 'Mon–Sun · 11am – 12am' },
  { city: 'Austin',       neighborhood: 'South Lamar',      address: '1701 South Lamar Blvd, Austin',    hours: 'Mon–Sun · 11am – 11pm' },
  { city: 'Chicago',      neighborhood: 'Wicker Park',      address: '1620 N Damen Ave, Chicago',        hours: 'Mon–Sun · 11am – 12am' },
  { city: 'London',       neighborhood: 'Soho',             address: '34 Berwick St, London W1',         hours: 'Mon–Sun · 12pm – 11pm' },
  { city: 'Tokyo',        neighborhood: 'Shibuya',          address: '1-2-3 Shibuya, Shibuya-ku',        hours: 'Mon–Sun · 12pm – 1am' },
];

export default function LocationsPage() {
  const ref = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.locations-hero > *', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.18,
      });

      gsap.from('.location-card', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.locations-grid',
          start: 'top 85%',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={ref} className="locations-page">
      <div className="locations-hero">
        <span className="page-eyebrow">Find Us</span>
        <h1>Six cities. One promise.</h1>
        <p>Every location flame-grills to order. Open until late.</p>
      </div>

      <div className="locations-grid">
        {LOCATIONS.map((loc) => (
          <article key={loc.city} className="location-card">
            <span className="location-pin" aria-hidden="true" />
            <div className="location-neighborhood">{loc.neighborhood}</div>
            <h2 className="location-city">{loc.city}</h2>
            <p className="location-address">{loc.address}</p>
            <p className="location-hours">{loc.hours}</p>
            <a className="location-link" href="#">Get directions →</a>
          </article>
        ))}
      </div>
    </main>
  );
}
