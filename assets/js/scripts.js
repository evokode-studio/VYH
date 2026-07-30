document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // NAVBAR SCROLL & MENU MÓVIL
    // ==========================================
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // 1. Manejo del fondo borroso
            if (currentScrollY > 50) {
                navbar.classList.add('navbar--scrolled');
            } else {
                navbar.classList.remove('navbar--scrolled');
            }

            // 2. Esconder al bajar, mostrar al subir
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.classList.add('navbar--hidden'); // Usuario baja
            } else if (currentScrollY < lastScrollY) {
                navbar.classList.remove('navbar--hidden'); // Usuario sube
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // Menú móvil (Hamburguesa a X)
    const menuBtn = document.getElementById('menu-btn');
    const menuLinks = document.getElementById('menu-links');

    if(menuBtn && menuLinks) {
        menuBtn.addEventListener('click', () => {
            // Alterna la clase active en ambos (menú y botón)
            menuLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        menuLinks.addEventListener('click', (e) => {
            if(e.target.tagName === 'A') {
                menuLinks.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    }

    // ==========================================
    // CALENDARIO (.ICS y Dropdown)
    // ==========================================
    const calendarBtn = document.getElementById('calendar-btn');
    const calendarDropdown = document.getElementById('calendar-dropdown');
    
    if (calendarBtn && calendarDropdown) {
        calendarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            calendarDropdown.classList.toggle('hidden');
        });

        window.addEventListener('click', function(e) {
            if (!calendarBtn.contains(e.target) && !calendarDropdown.contains(e.target)) {
                calendarDropdown.classList.add('hidden');
            }
        });
    }

    const btnIcs = document.getElementById('cal-ics');
    if (btnIcs) {
        btnIcs.addEventListener('click', function(e) {
            e.preventDefault();
            const icsContent = 
                "BEGIN:VCALENDAR\n" +
                "VERSION:2.0\n" +
                "PRODID:-//Vows and Lovers//Boda Vero y Humberto//ES\n" +
                "BEGIN:VEVENT\n" +
                "DTSTART:20261010T160000\n" +
                "DTEND:20261011T020000\n" +
                "SUMMARY:Boda Vero & Humberto\n" +
                "LOCATION:NH Quinta, Lerdo, Durango\n" +
                "DESCRIPTION:¡Nos hace mucha ilusión compartir este día contigo!\n" +
                "END:VEVENT\n" +
                "END:VCALENDAR";

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'Boda_Vero_y_Humberto.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // ==========================================
    // COPY NUMBER (Regalos)
    // ==========================================
    const copyBtn = document.querySelector('.gift__copy-icon');
    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            const accountSpan = document.getElementById("accountNumber");
            if(accountSpan) {
                const num = accountSpan.innerText;
                navigator.clipboard.writeText(num).then(() => {
                    alert("¡Número de cuenta copiado!");
                }).catch(err => console.error('Error al copiar', err));
            }
        });
    }

    // ==========================================
    // POP-UP MODAL (MENSAJES)
    // ==========================================
    const openBtn = document.getElementById('openMessageModal');
    const closeBtn = document.getElementById('closeMessageModal');
    const modal = document.getElementById('messageModal');

    // Abrir el modal
    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.showModal(); 
        });
    }

    // Cerrar el modal desde la X
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.close();
        });
    }

    // Cerrar el modal al hacer clic afuera del recuadro blanco
    if (modal) {
        modal.addEventListener('click', (e) => {
            const dialogDimensions = modal.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                modal.close();
            }
        });
    }

});

// ==========================================
// COUNTDOWN (Queda fuera del DOMContentLoaded por el setInterval)
// ==========================================
const targetDate = new Date('October 10, 2026 16:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if(daysEl && hoursEl && minutesEl && secondsEl) {
        if (distance < 0) {
            daysEl.innerText = "00";
            hoursEl.innerText = "00";
            minutesEl.innerText = "00";
            secondsEl.innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = days.toString().padStart(2, '0');
        hoursEl.innerText = hours.toString().padStart(2, '0');
        minutesEl.innerText = minutes.toString().padStart(2, '0');
        secondsEl.innerText = seconds.toString().padStart(2, '0');
    }
}
setInterval(updateCountdown, 1000);
updateCountdown();