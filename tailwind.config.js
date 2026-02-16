/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                frozen: '#f8dfed',         // Lightest pink - Backgrounds
                'icy-veil': '#e4b6d0',     // Light pink - Secondary backgrounds/Accents
                'glacier-glow': '#de8fab', // Medium pink - Tertiary accents
                'frost-byte': '#cf6a86',   // Darker pink - Primary buttons/Links
                'midnight-chill': '#8f0f24', // Deep red - Headings/Strong text
                'polar-night': '#5b1824',    // Very dark burgundy - General text/Footer
                'bg-primary': '#f8dfed',
                'bg-secondary': '#ffffff',
                'bg-accent': '#e4b6d0',
                'text-primary': '#5b1824',
                'text-secondary': '#8f0f24',
            },
            fontFamily: {
                heading: ['"Playfair Display"', 'serif'],
                body: ['"Cormorant Garamond"', 'serif'],
                lobster: ['"Lobster"', 'cursive'],
            },
        },
    },
    plugins: [],
}
