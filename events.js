import { getSettings } from './settings.js';

export async function applyEventTheme() {
    try {
        const settings = await getSettings();
        if (settings && settings.active_event && settings.active_event !== 'none') {
            document.body.classList.add(`event-${settings.active_event}`);
            
            // Inject events.css if not present
            if (!document.getElementById('events-css')) {
                const link = document.createElement('link');
                link.id = 'events-css';
                link.rel = 'stylesheet';
                link.href = 'events.css';
                document.head.appendChild(link);
            }
        }
    } catch (e) {
        console.error("Failed to load event theme:", e);
    }
}
