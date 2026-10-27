/**
 * Green Voice Global (NGO) - Main JavaScript
 * Voice of Voiceless &bull; Established 2001
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. Toast Notification Utility
  // ==========================================
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, icon = 'fa-check-circle', duration = 3500) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ==========================================
  // 2. Accessibility Controls (High Contrast & Font Scaling)
  // ==========================================
  const toggleContrastBtn = document.getElementById('toggle-contrast-btn');
  const fontIncreaseBtn = document.getElementById('font-increase-btn');
  const fontDecreaseBtn = document.getElementById('font-decrease-btn');

  // Check saved contrast preference
  if (localStorage.getItem('gv_high_contrast') === 'enabled') {
    document.body.classList.add('high-contrast');
  }

  if (toggleContrastBtn) {
    toggleContrastBtn.addEventListener('click', () => {
      const isHighContrast = document.body.classList.toggle('high-contrast');
      localStorage.setItem('gv_high_contrast', isHighContrast ? 'enabled' : 'disabled');
      showToast(isHighContrast ? 'High Contrast Mode Enabled' : 'High Contrast Mode Disabled', 'fa-circle-half-stroke');
    });
  }

  let fontScaleState = 0; // 0: Normal, 1: Large, 2: Larger
  if (fontIncreaseBtn) {
    fontIncreaseBtn.addEventListener('click', () => {
      if (fontScaleState === 0) {
        document.body.classList.add('font-large');
        fontScaleState = 1;
        showToast('Text Size: Large', 'fa-font');
      } else if (fontScaleState === 1) {
        document.body.classList.remove('font-large');
        document.body.classList.add('font-larger');
        fontScaleState = 2;
        showToast('Text Size: Extra Large', 'fa-font');
      }
    });
  }

  if (fontDecreaseBtn) {
    fontDecreaseBtn.addEventListener('click', () => {
      if (fontScaleState === 2) {
        document.body.classList.remove('font-larger');
        document.body.classList.add('font-large');
        fontScaleState = 1;
        showToast('Text Size: Large', 'fa-font');
      } else if (fontScaleState === 1) {
        document.body.classList.remove('font-large');
        fontScaleState = 0;
        showToast('Text Size: Standard', 'fa-font');
      }
    });
  }

  // ==========================================
  // 3. Header Scroll Effect & Mobile Hamburger
  // ==========================================
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside of nav menu
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Reset when resizing window to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1200 && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ScrollSpy Active Link Tracking
  const sections = document.querySelectorAll('section[id], header[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // ==========================================
  // 4. One-Click Clipboard Copying
  // ==========================================
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        btn.style.color = '#15803d';

        showToast(`Copied to clipboard: ${textToCopy}`, 'fa-clipboard-check');

        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.style.color = '';
        }, 2200);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied: ${textToCopy}`, 'fa-clipboard-check');
      }
    });
  });

  // ==========================================
  // 5. Interactive Donation Calculator
  // ==========================================
  const presetButtons = document.querySelectorAll('.preset-btn');
  const customDonationInput = document.getElementById('custom-donation-input');
  const impactTextContent = document.getElementById('impact-text-content');
  const btnAmountDisplay = document.getElementById('btn-amount-display');
  const confirmDonationBtn = document.getElementById('confirm-donation-btn');

  const impactNarratives = {
    340: "<strong>Your ₹340 contribution:</strong> Provides 1 month of evening tuition, essential study materials for an underprivileged child, and plants 2 saplings.",
    680: "<strong>Your ₹680 contribution:</strong> Supports 2 village students with after-school education, notebooks, geometry kits, and counseling to beat exam fear.",
    1000: "<strong>Your ₹1,000 contribution:</strong> Funds 5 tree saplings in rural schools + covers school supplies and eye checkups for marginalized children.",
    2500: "<strong>Your ₹2,500 contribution:</strong> Sponsors free diagnostic kits and medicine supplies for an entire village medical camp session."
  };

  function updateDonationImpact(amount) {
    if (btnAmountDisplay) {
      btnAmountDisplay.textContent = Number(amount).toLocaleString('en-IN');
    }

    if (impactNarratives[amount]) {
      impactTextContent.innerHTML = impactNarratives[amount];
    } else {
      const estimatedTrees = Math.max(1, Math.floor(amount / 120));
      const estimatedStudents = Math.max(1, Math.floor(amount / 340));
      impactTextContent.innerHTML = `<strong>Your ₹${Number(amount).toLocaleString('en-IN')} contribution:</strong> Powers our community mission—planting approx. <strong>${estimatedTrees} trees</strong> and supporting <strong>${estimatedStudents} students</strong> with free study materials.`;
    }
  }

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-amount');
      if (customDonationInput) {
        customDonationInput.value = val;
      }
      updateDonationImpact(val);
    });
  });

  if (customDonationInput) {
    customDonationInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) || 0;
      presetButtons.forEach(b => {
        if (b.getAttribute('data-amount') == val) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      updateDonationImpact(val);
    });
  }

  // ==========================================
  // 6. Quick Donation Drawer / Modal
  // ==========================================
  const quickDonateModal = document.getElementById('quick-donate-modal');
  const closeDonateModalBtn = document.getElementById('close-donate-modal-btn');
  const openDonateModalBtns = document.querySelectorAll('.open-donate-modal-btn');
  const donorAmountInput = document.getElementById('donor-amount');
  const donationNotifierForm = document.getElementById('donation-notifier-form');
  const donationStatusMsg = document.getElementById('donation-status-msg');

  function openDonateModal(amount = 340) {
    if (!quickDonateModal) return;
    if (donorAmountInput) donorAmountInput.value = amount;
    quickDonateModal.classList.add('open');
    quickDonateModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDonateModal() {
    if (!quickDonateModal) return;
    quickDonateModal.classList.remove('open');
    quickDonateModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openDonateModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preset = btn.getAttribute('data-preset') || (customDonationInput ? customDonationInput.value : 340);
      openDonateModal(preset);
    });
  });

  if (confirmDonationBtn) {
    confirmDonationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentAmt = customDonationInput ? customDonationInput.value : 340;
      openDonateModal(currentAmt);
    });
  }

  if (closeDonateModalBtn) {
    closeDonateModalBtn.addEventListener('click', closeDonateModal);
  }

  if (donationNotifierForm) {
    donationNotifierForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('donor-name').value;
      const amt = document.getElementById('donor-amount').value;
      const email = document.getElementById('donor-email').value;

      donationStatusMsg.className = 'status-msg success';
      donationStatusMsg.innerHTML = `<strong>Thank you, ${name}!</strong> Your generous pledge of ₹${amt} has been recorded. An official 80G tax receipt will be sent to <strong>${email}</strong> upon bank verification.`;
      
      showToast(`Thank you, ${name}! Your donation receipt request is submitted.`, 'fa-heart');
      setTimeout(() => {
        donationNotifierForm.reset();
        setTimeout(closeDonateModal, 2500);
      }, 1000);
    });
  }

  // ==========================================
  // 7. Gallery Category Filtering & Lightbox
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('image-lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });
    });
  });

  // Lightbox click on cards
  galleryItems.forEach(item => {
    const card = item.querySelector('.gallery-card');
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('h4')?.textContent || '';
      const desc = card.querySelector('p')?.textContent || '';

      if (lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxCaption.innerHTML = `<strong>${title}</strong><br><small>${desc}</small>`;
        lightboxModal.classList.add('open');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('open');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  // ==========================================
  // 8. Blog Reader Modal
  // ==========================================
  const blogModal = document.getElementById('blog-reader-modal');
  const closeBlogModalBtn = document.getElementById('close-blog-modal-btn');
  const blogModalContent = document.getElementById('blog-modal-content');
  const readMoreButtons = document.querySelectorAll('.btn-read-more');

  const blogArticles = {
    post1: {
      date: "February 02, 2023",
      category: "Environment & Waste Management",
      title: "Our Recent Best Project: Waste Management Camp in Collaboration with NCC Cadets",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
      content: `
        <p>On February 02, 2023, Green Voice Global organized a landmark comprehensive waste management camp in structured collaboration with the National Cadet Corps (NCC) cadets and local student leaders.</p>
        <p>The primary thrust was educating urban and peri-urban dwellers on the necessity of source segregation, eliminating single-use plastics, and adopting localized organic composting methods.</p>
        <h4>Key Milestones Achieved:</h4>
        <ul style="margin-left: 1.25rem; margin-bottom: 1rem; line-height: 1.8;">
          <li>Over 450 households surveyed and educated door-to-door.</li>
          <li>Collection and safe disposal of 1.2 tons of non-biodegradable roadside litter along local canal paths.</li>
          <li>Interactive briefing on plastic recycling channels, supported by local municipal sanitation workers.</li>
        </ul>
        <p>Founder &amp; Chairman Mr. C.S. Veerraghavan delivered an inspiring address highlighting that environmental cleanliness is a fundamental civic obligation. Our hearty thanks to the committed NCC officers, cadets, and local volunteers who made this drive a grand success.</p>
      `
    },
    post2: {
      date: "December 15, 2022",
      category: "Child Education Outreach",
      title: "Bringing Education to Life: Empowering Government School Students",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
      content: `
        <p>Education is the supreme equalizer. On December 15, 2022, Green Voice Global visited a rural government high school to distribute essential learning materials and conduct our signature career confidence session.</p>
        <p>Many children from underprivileged households face intense examination anxiety and lack basic school accessories. Our trust distributed over 300 customized study kits comprising notebook sets, geometry instruments, writing pens, and school bags.</p>
        <h4>Special Focus Areas:</h4>
        <ul style="margin-left: 1.25rem; margin-bottom: 1rem; line-height: 1.8;">
          <li><strong>Overcoming Exam Fear:</strong> Psychological workshops guiding students on breathing techniques, study schedules, and stress reduction.</li>
          <li><strong>Language Skill Development:</strong> Introducing fundamental supplementary readers in Tamil, English, and Hindi.</li>
          <li><strong>Scholarship Announcements:</strong> Ten deserving students were awarded full academic material sponsorships for the upcoming academic year.</li>
        </ul>
        <p>We extend our deepest gratitude to our monthly ₹340 donors whose consistent benevolence turns these drives into regular realities.</p>
      `
    }
  };

  readMoreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const postId = btn.getAttribute('data-post');
      const article = blogArticles[postId];
      if (!article || !blogModalContent) return;

      blogModalContent.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <span style="display:inline-block; background:#dcfce7; color:#15803d; font-size:0.8rem; font-weight:700; padding:0.25rem 0.75rem; border-radius:9999px; margin-bottom:0.5rem;">${article.category}</span>
          <span style="font-size:0.85rem; color:#64748b; margin-left:0.5rem;"><i class="fa-regular fa-calendar"></i> ${article.date}</span>
          <h2 style="font-size:1.65rem; font-weight:800; color:#1e293b; margin-top:0.5rem; line-height:1.3;">${article.title}</h2>
        </div>
        <img src="${article.image}" alt="${article.title}" style="width:100%; border-radius:12px; margin-bottom:1.5rem; max-height:350px; object-fit:cover;">
        <div style="font-size:1rem; color:#334155; line-height:1.7;">
          ${article.content}
        </div>
        <div style="margin-top:2rem; padding-top:1.25rem; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.88rem; color:#64748b;">Green Voice Global &bull; Voice of Voiceless</span>
          <a href="#donate" class="btn btn-primary btn-sm" onclick="document.getElementById('blog-reader-modal').classList.remove('open');">Support Next Camp</a>
        </div>
      `;

      blogModal.classList.add('open');
      blogModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBlogModalBtn) {
    closeBlogModalBtn.addEventListener('click', () => {
      blogModal.classList.remove('open');
      blogModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  // ==========================================
  // 9. Volunteer Registration Form
  // ==========================================
  const volunteerForm = document.getElementById('volunteer-form');
  const volunteerStatusMsg = document.getElementById('volunteer-status-msg');

  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('vol-name').value;
      const area = document.getElementById('vol-area').value;

      volunteerStatusMsg.className = 'status-msg success';
      volunteerStatusMsg.innerHTML = `<strong>Welcome aboard, ${name}!</strong> Thank you for volunteering for <strong>${area}</strong>. Our trust coordinator will contact you via phone/email shortly.`;

      showToast(`Thank you, ${name}! Volunteer application submitted successfully.`, 'fa-user-check');
      volunteerForm.reset();
    });
  }

  // ==========================================
  // 10. Contact Form with Math Captcha (50 - 20 = 30)
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const contactStatusMsg = document.getElementById('contact-status-msg');
  const contactCaptcha = document.getElementById('contact-captcha');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const captchaVal = parseInt(contactCaptcha.value, 10);

      // Verify 50 - 20 = 30
      if (captchaVal !== 30) {
        contactStatusMsg.className = 'status-msg error';
        contactStatusMsg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Security question incorrect. Please calculate: <strong>50 &minus; 20 = 30</strong>.';
        contactCaptcha.focus();
        showToast('Security verification failed. 50 - 20 = 30', 'fa-shield-halved');
        return;
      }

      contactStatusMsg.className = 'status-msg success';
      contactStatusMsg.innerHTML = `<strong>Message Sent Successfully!</strong> Thank you ${name}, our trustees have received your communication and will reply via email shortly.`;

      showToast('Message sent to greenvoicengo@gmail.com!', 'fa-paper-plane');
      contactForm.reset();
    });
  }

  // ==========================================
  // 11. FAQ Accordion Toggle
  // ==========================================
  const faqHeaders = document.querySelectorAll('.faq-accordion-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isOpen = header.getAttribute('aria-expanded') === 'true';

      // Close all other accordion items
      faqHeaders.forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        if (h.nextElementSibling) {
          h.nextElementSibling.classList.remove('active');
        }
      });

      if (!isOpen) {
        header.setAttribute('aria-expanded', 'true');
        content.classList.add('active');
      }
    });
  });

  // ==========================================
  // 12. Upcoming Event Countdown Widget
  // ==========================================
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  // Set recurring or future target date
  let targetEventDate = new Date();
  targetEventDate.setDate(targetEventDate.getDate() + 18);
  targetEventDate.setHours(7, 0, 0, 0);

  function tickCountdown() {
    const now = new Date().getTime();
    const distance = targetEventDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
      if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
      if (cdMins) cdMins.textContent = String(minutes).padStart(2, '0');
      if (cdSecs) cdSecs.textContent = String(seconds).padStart(2, '0');
    }
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  // ==========================================
  // 13. Privacy Policy & Terms Legal Modals
  // ==========================================
  const legalModal = document.getElementById('legal-modal');
  const closeLegalModalBtn = document.getElementById('close-legal-modal-btn');
  const legalModalContent = document.getElementById('legal-modal-content');
  const openPrivacyModal = document.getElementById('open-privacy-modal');
  const openTermsModal = document.getElementById('open-terms-modal');

  function openLegalModal(title, text) {
    if (!legalModal || !legalModalContent) return;
    legalModalContent.innerHTML = `
      <h2 style="font-size:1.6rem; font-weight:800; color:#1e293b; margin-bottom:1rem;">${title}</h2>
      <div style="font-size:0.95rem; color:#475569; line-height:1.7;">
        ${text}
      </div>
    `;
    legalModal.classList.add('open');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  if (openPrivacyModal) {
    openPrivacyModal.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal(
        "Privacy Policy &bull; Green Voice Global",
        `
        <p>Green Voice Global (Voice of Voiceless) is deeply committed to upholding your privacy. Any personal information provided—including donor names, phone numbers, email addresses, and PAN details—is collected exclusively to process voluntary donations, issue official 80G tax receipts, and communicate trust updates.</p>
        <p>We do not sell, rent, or lease donor records to third-party marketing companies. All financial transfers go directly into our verified State Bank of India trust account.</p>
        <p>For questions regarding your data, contact us at <strong>greenvoicengo@gmail.com</strong>.</p>
        `
      );
    });
  }

  if (openTermsModal) {
    openTermsModal.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal(
        "Terms & Conditions &bull; Green Voice Global",
        `
        <p>Welcome to Green Voice Global. By accessing our platform and making contributions, you agree to our terms of stewardship:</p>
        <ul style="margin-left: 1.25rem; line-height: 1.8;">
          <li>All donations are voluntary contributions towards our education, health, and environmental programs.</li>
          <li>Donations qualify for up to 50% deduction under Section 80G of the Indian Income Tax Act (Reg No: <code>AAETG2499KF20221</code>).</li>
          <li>Receipts are generated after donor PAN and transaction verification.</li>
          <li>Green Voice Global reserves the right to allocate donations to immediate relief camps and educational activities in accordance with trust objectives.</li>
        </ul>
        <p style="margin-top:1rem;">Registered with the United Nations NGO Council. Est. 2001.</p>
        `
      );
    });
  }

  if (closeLegalModalBtn) {
    closeLegalModalBtn.addEventListener('click', () => {
      legalModal.classList.remove('open');
      legalModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  // Universal close modal on clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      });
      document.body.style.overflow = '';
    }
  });

});
