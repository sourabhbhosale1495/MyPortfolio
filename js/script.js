document.addEventListener("DOMContentLoaded", () => {
    const progressBars = document.querySelectorAll(".progress-bar");
    const revealItems = document.querySelectorAll(".reveal");
    const skillsSection = document.getElementById("skills");
    const projectModal = document.getElementById("projectModal");
    const toggleBtn = document.getElementById("themeToggle");
    const themeIcon = document.querySelector(".theme-icon");
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMsg");
    const body = document.body;
    let skillsAnimated = false;

    const setThemeIcon = () => {
        themeIcon.innerHTML = body.classList.contains("dark-mode") ? "&#9728;" : "&#9790;";
    };

    const animateSkills = () => {
        if (skillsAnimated) {
            return;
        }

        progressBars.forEach((bar) => {
            const value = bar.getAttribute("data-skill");
            bar.style.width = `${value}%`;
        });

        skillsAnimated = true;
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18 });

    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 60, 320)}ms`;
        revealObserver.observe(item);
    });

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    if (projectModal) {
        projectModal.addEventListener("show.bs.modal", (event) => {
            const button = event.relatedTarget;

            document.getElementById("modalTitle").textContent = button.getAttribute("data-title");
            document.getElementById("modalDesc").textContent = button.getAttribute("data-desc");
            document.getElementById("modalTech").textContent = button.getAttribute("data-tech");
        });
    }

    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }
    setThemeIcon();

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
            setThemeIcon();
        });
    }

    const showFormMessage = (message, color) => {
        if (!formMessage) {
            return;
        }

        formMessage.textContent = message;
        formMessage.style.color = color;
    };

    if (contactForm) {
        const publicKey = contactForm.dataset.publicKey;
        const serviceId = contactForm.dataset.serviceId;
        const templateId = contactForm.dataset.templateId;

        if (window.emailjs && publicKey) {
            emailjs.init(publicKey);
        }

        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                showFormMessage("Please fill in all fields.", "#dc3545");
                return;
            }

            if (!window.emailjs) {
                showFormMessage("Email service failed to load. Please refresh and try again.", "#dc3545");
                return;
            }

            if (!publicKey) {
                showFormMessage("Add your EmailJS public key to activate the contact form.", "#dc3545");
                return;
            }

            try {
                showFormMessage("Sending message...", "#1d4ed8");
                await emailjs.sendForm(serviceId, templateId, this);
                showFormMessage("Message sent successfully!", "#198754");
                this.reset();
            } catch (error) {
                showFormMessage("Message failed to send. Please check your EmailJS keys.", "#dc3545");
                console.error("EmailJS error:", error);
            }
        });
    }
});
