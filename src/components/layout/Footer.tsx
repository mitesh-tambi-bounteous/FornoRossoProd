import { Logo } from './Logo';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '../icons/Icon';

const KITCHEN_HOURS = [
  { day: 'Monday - Thursday', hours: '12:00 PM - 10:00 PM' },
  { day: 'Friday - Saturday', hours: '12:00 PM - 11:30 PM' },
  { day: 'Sunday', hours: '1:00 PM - 9:30 PM' },
];

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__brand">
        <Logo />
        <p className="app-footer__blurb">
          Artisanal wood-fired sourdough pizzas crafted with 48-hour fermented dough and
          imported San Marzano ingredients. Delivered fresh and piping hot.
        </p>
        <div className="app-footer__social">
          <a href="#" className="app-footer__social-link" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="#" className="app-footer__social-link" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="#" className="app-footer__social-link" aria-label="Twitter">
            <TwitterIcon />
          </a>
        </div>
      </div>

      <div className="app-footer__column">
        <h3 className="app-footer__column-heading">Kitchen Hours</h3>
        {KITCHEN_HOURS.map((row) => (
          <div className="app-footer__schedule-row" key={row.day}>
            <span>{row.day}</span>
            <span>{row.hours}</span>
          </div>
        ))}
      </div>

      <div className="app-footer__column">
        <h3 className="app-footer__column-heading">Pizzeria Location</h3>
        <p>842 Rione Monti, Sourdough Avenue, Suite 100</p>
        <p>(555) 392-7677</p>
        <p>ciao@fornorosso.pizza</p>
      </div>

      <hr className="app-footer__divider" />

      <div className="app-footer__bottom">
        <p>© 2026 Forno Rosso Pizzeria. All rights reserved.</p>
        <div className="app-footer__bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Delivery Terms</a>
        </div>
      </div>
    </footer>
  );
}
