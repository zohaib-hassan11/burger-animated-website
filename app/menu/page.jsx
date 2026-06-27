'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const MENU = {
  'Signature Burgers': [
    { name: 'The Classic',     desc: 'Beef, aged cheddar, lettuce, tomato, secret sauce.',     price: '$11' },
    { name: 'Double Trouble',  desc: 'Two stacked patties, double cheese, caramelised onion.', price: '$14' },
    { name: 'The Smokehouse',  desc: 'Hickory bacon, smoked gouda, BBQ glaze.',                price: '$13' },
    { name: 'Mushroom Melt',   desc: 'Truffle aioli, Swiss, sautéed cremini.',                 price: '$13' },
    { name: 'Spicy Jalapeño',  desc: 'Pepper jack, candied jalapeño, chipotle mayo.',          price: '$12' },
    { name: 'The Garden',      desc: 'House-made veggie patty, avocado, sprouts.',             price: '$11' },
  ],
  'Sides': [
    { name: 'Shoestring Fries',     desc: 'Hand-cut, sea-salted, golden.',                price: '$5' },
    { name: 'Loaded Cheese Fries',  desc: 'Melted cheddar, scallions, bacon bits.',       price: '$8' },
    { name: 'Onion Rings',          desc: 'Beer-battered, crispy, with chipotle dip.',    price: '$6' },
    { name: 'Sweet Potato Wedges',  desc: 'Maple-glazed, rosemary, flaky salt.',          price: '$6' },
  ],
  'Shakes & Drinks': [
    { name: 'Vanilla Shake',        desc: 'Real Madagascar vanilla bean.',          price: '$6' },
    { name: 'Chocolate Malt',       desc: 'Belgian dark chocolate, malt powder.',   price: '$6' },
    { name: 'Salted Caramel Shake', desc: 'Slow-cooked caramel, flaky sea salt.',   price: '$7' },
    { name: 'Craft Lemonade',       desc: 'Fresh lemon, honey, mint.',              price: '$5' },
  ],
};

export default function MenuPage() {
  const ref = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.menu-hero > *', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.18,
      });

      gsap.utils.toArray('.menu-category').forEach((cat) => {
        const name = cat.querySelector('.menu-category-name');
        const cards = cat.querySelectorAll('.menu-card');
        gsap.from([name, ...cards], {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.07,
          scrollTrigger: {
            trigger: cat,
            start: 'top 82%',
          },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={ref} className="menu-page">
      <div className="menu-hero">
        <span className="page-eyebrow">Our Menu</span>
        <h1>Made by hand. Fired to order.</h1>
        <p>Every item on the menu is built fresh — no shortcuts, no compromises.</p>
      </div>

      {Object.entries(MENU).map(([category, items]) => (
        <section key={category} className="menu-category">
          <h2 className="menu-category-name">{category}</h2>
          <div className="menu-grid">
            {items.map((item) => (
              <article key={item.name} className="menu-card">
                <div className="menu-card-header">
                  <span className="menu-card-name">{item.name}</span>
                  <span className="menu-card-price">{item.price}</span>
                </div>
                <p className="menu-card-desc">{item.desc}</p>
                <span className="menu-card-add">Add to order →</span>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
