# Quick Testing Checklist

## Visual Changes to Verify

### ✅ Navbar
- [ ] Logo is now 48px height (bigger than before)
- [ ] Logo visible on mobile

### ✅ Hero Section
- [ ] Grid background pattern visible (60px squares)
- [ ] Badge animates in first (0.2s delay)
- [ ] Two founder photos between headline and buttons (side by side)
- [ ] Photos are 160px × 208px with rounded corners
- [ ] Headline words appear one by one
- [ ] Ticker line words appear one by one
- [ ] Buttons are on ONE horizontal line (not stacked)
- [ ] Community counter animates from 0 to 44.8k+
- [ ] Instagram link below counter
- [ ] City list includes: Pune, Surat, Mumbai, Solapur, Thane, Nashik, Nagpur, All India
- [ ] NO paragraph between headline and buttons

### ✅ Services Section
- [ ] Label says "Our Work" (not "What We Do")
- [ ] Heading: "Turning Visions Into Digital Reality"
- [ ] Subtext: "Real projects, real results..."

### ✅ Projects Section
- [ ] Cards have cover images
- [ ] Hover: card scales up (1.03)
- [ ] Hover: image zooms inside card (1.07)
- [ ] Smooth transition with shadow

### ✅ Testimonials Section
- [ ] Text testimonials at top
- [ ] "Video Reviews" label below
- [ ] Portrait video cards (140px × 220px)
- [ ] Horizontal scrollable row
- [ ] Play icon on each card
- [ ] Click opens modal/lightbox

### ✅ Process Section
- [ ] REMOVED - should not appear on page

### ✅ Contact Section
- [ ] Email: shivam.garud2011@gmail.com
- [ ] Phone: +91 7434895001
- [ ] WhatsApp: https://wa.me/message/UNJZ4N7XVUHSB1
- [ ] LinkedIn: https://www.linkedin.com/company/cloudbuild-technologies/
- [ ] Instagram: @cloud_build_
- [ ] Cities: Pune, Surat, Mumbai, Solapur, Thane, Nashik, Nagpur, All India

### ✅ Footer
- [ ] LinkedIn: https://www.linkedin.com/company/cloudbuild-technologies/
- [ ] WhatsApp: https://wa.me/message/UNJZ4N7XVUHSB1

### ✅ Floating Buttons
- [ ] WhatsApp (bottom right): https://wa.me/message/UNJZ4N7XVUHSB1
- [ ] Instagram (bottom left): https://instagram.com/cloud_build_

## Animation Testing

### Page Load (First Visit)
1. [ ] Navbar slides down from top
2. [ ] Hero badge fades up
3. [ ] Photos fade in with scale (left then right)
4. [ ] Headline words appear one by one
5. [ ] Ticker words appear one by one
6. [ ] Buttons fade up
7. [ ] Counter animates from 0 to 44.8k+
8. [ ] Instagram link fades up
9. [ ] Trust bar fades up

### Scroll Animations
- [ ] Service cards fade up when scrolling into view
- [ ] Project cards fade up with stagger
- [ ] Testimonial cards fade up
- [ ] All sections animate once on first view

### Hover Animations
- [ ] Project cards: scale + image zoom
- [ ] Service cards: scale + shadow
- [ ] All buttons: color transitions

## Functional Testing

### Contact Form
- [ ] Fill out form with all fields
- [ ] Submit form
- [ ] Check owner email: shivam.garud2011@gmail.com
- [ ] Check user receives auto-reply
- [ ] Verify email templates match specification

### Links
- [ ] All WhatsApp links go to: https://wa.me/message/UNJZ4N7XVUHSB1
- [ ] All LinkedIn links go to: https://www.linkedin.com/company/cloudbuild-technologies/
- [ ] All Instagram links go to: https://instagram.com/cloud_build_
- [ ] Project links open in new tab

### Video Modal
- [ ] Click video card
- [ ] Modal opens with video
- [ ] Close button works
- [ ] Click outside closes modal

## Mobile Testing
- [ ] Logo visible and not cropped
- [ ] Buttons stack on small screens
- [ ] Photos display properly
- [ ] Video cards scroll horizontally
- [ ] All animations work smoothly
- [ ] Contact form usable

## Performance
- [ ] Page loads quickly
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts
- [ ] Images load properly

---

## Email Setup (Backend)

### Required Steps:
1. Install nodemailer: `npm install nodemailer`
2. Get Gmail App Password from myaccount.google.com
3. Create `.env` file with credentials
4. Implement serverless function using code in `src/api/contact.ts`
5. Test email delivery

### Test Email Flow:
1. Submit contact form
2. Owner receives notification email
3. User receives auto-reply email
4. Both emails have correct formatting
5. All links in emails work

---

**All 12 changes implemented and ready for testing!**
