// firebase-messages.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA639QluOIflWtaYUf1LPSMkiEOB7UjJi8",
  authDomain: "vyhw-221de.firebaseapp.com",
  projectId: "vyhw-221de",
  storageBucket: "vyhw-221de.firebasestorage.app",
  messagingSenderId: "1044553168528",
  appId: "1:1044553168528:web:c482685edd2cc41aafca15"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const modal = document.getElementById('messageModal'); 
const openModalBtn = document.getElementById('openMessageModal'); 
const closeBtn = document.getElementById('closeMessageModal');
const msgForm = document.getElementById('messageForm'); 
const carouselTrack = document.getElementById('messagesCarousel'); 

if (openModalBtn && modal && closeBtn) {
    openModalBtn.addEventListener('click', () => {
        modal.showModal();
    });

    closeBtn.addEventListener('click', () => {
        modal.close();
    });

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

const q = query(collection(db, "mensajes"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
    if (!carouselTrack) return;
    
    let contentHTML = '';
    
    if (snapshot.empty) {
        contentHTML = `
            <div class="media-section__mat">
                <p class="media-section__mat-text">"Les deseo lo más bonito en esta nueva etapa..."</p>
                <span class="media-section__mat-author">- Luisa Campos</span>
            </div>
            <div class="media-section__mat">
                <p class="media-section__mat-text">"Estamos listísimos para el gran día. ¡Felicidades!"</p>
                <span class="media-section__mat-author">- Fam. Gutiérrez</span>
            </div>
        `;
    } else {
        snapshot.forEach((doc) => {
            const data = doc.data();
            contentHTML += `
                <div class="media-section__mat">
                    <p class="media-section__mat-text">"${data.mensaje}"</p>
                    <span class="media-section__mat-author">- ${data.nombre}</span>
                </div>
            `;
        });
    }
    
carouselTrack.innerHTML = contentHTML + contentHTML;
    
    carouselTrack.style.animation = 'none'; // Apaga la animación
    carouselTrack.offsetHeight; // Fuerza al navegador a recalcular el tamaño
    carouselTrack.style.animation = 'scrollCarousel 20s linear infinite'; // La vuelve a encender
});

if (msgForm) {
    msgForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nombreInput = document.getElementById('msg-name');
        const mensajeInput = document.getElementById('msg-text');
        
        const nombre = nombreInput.value.trim();
        const mensaje = mensajeInput.value.trim();
        
        const submitBtn = msgForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Enviando...";
        submitBtn.disabled = true;
        
        if (nombre && mensaje) {
            try {
                await addDoc(collection(db, "mensajes"), {
                    nombre: nombre,
                    mensaje: mensaje,
                    timestamp: new Date() 
                });
                
                msgForm.reset();
                modal.close(); 
            } catch (error) {
                console.error("Error al enviar mensaje: ", error);
                alert("Hubo un error al enviar tu mensaje. Revisa tu conexión.");
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}